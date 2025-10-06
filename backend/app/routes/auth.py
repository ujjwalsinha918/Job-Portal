from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
import secrets
import logging
import urllib.parse
import httpx

from app.core.config import settings
from app.core import security
from app.core.database import get_db
from app.crud import users as user_crud
from app.schemas import user as user_schemas
from app.schemas.user import UserCreate, UserLogin, UserResponse as UserOut
from app.schemas.user import RoleUpdate
from fastapi.responses import JSONResponse


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

router = APIRouter(prefix="/auth")

# Debug cookies endpoint
@router.get("/debug/token")
async def debug_token(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    payload = security.decode_access_token(token) if token else None
    return {"token": token[:20] + "..." if token else "None", "payload": payload}


@router.get("/login/google")
async def login_via_google(request: Request):
    """Initiate Google OAuth - Simplified version"""
    try:

        # Generate state for CSRF protection
        state = secrets.token_urlsafe(32)

        # Store state in session
        request.session["oauth_state"] = state

        # Build Google OAuth URL with parameters
        params = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": settings.GOOGLE_REDIRECT_URL,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",  # for refresh token
            "prompt": "select_account",
        }

        google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
        auth_url = f"{google_auth_url}?{urllib.parse.urlencode(params)}"

        logger.info(f"Redirecting to: {auth_url[:100]}...")

        # Redirect user to Google login
        return RedirectResponse(url=auth_url, status_code=302)

    except Exception as e:
        logger.error(f"Error in Google OAuth initiation: {e}", exc_info=True)
        return JSONResponse(
            status_code=500, content={"error": f"Failed to initiate OAuth: {str(e)}"}
        )


@router.get("/google/callback")
async def auth_google_callback(request: Request, db: Session = Depends(get_db)):
    """Handle Google OAuth callback"""

    # Extract query parameters sent by Google
    code = request.query_params.get("code")  # needed to get tokens
    state = request.query_params.get(
        "state"
    )  # should match request.session["oauth_state"]
    error = request.query_params.get("error")

    if error:
        logger.error(f"OAuth error: {error}")
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}?error=oauth_error", status_code=302
        )

    if not code:
        logger.error("No authorization code received")
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}?error=no_code", status_code=302
        )

    # For now, let's skip state verification to test if the basic flow works
    logger.info("Code received successfully, processing...")

    

    try:
        # Exchange authorization code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",  # Google's token exchange endpoint
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": settings.GOOGLE_REDIRECT_URL,
                },
            )

            if token_response.status_code != 200:
                logger.error(f"Token exchange failed: {token_response.text}")
                return RedirectResponse(
                    url=f"{settings.FRONTEND_URL}?error=token_failed", status_code=302
                )

            token_data = token_response.json()
            google_access_token = token_data.get("access_token")

            # Fetch user info from Google
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",  #  Google's User Info Endpoint
                headers={"Authorization": f"Bearer {google_access_token}"},
            )

            if user_response.status_code != 200:
                logger.error("Failed to get user info")
                return RedirectResponse(
                    url=f"{settings.FRONTEND_URL}?error=user_info_failed",
                    status_code=302,
                )

            user_info = user_response.json()

    except Exception as e:
        logger.exception("Database/JWT error during OAuth callback")
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}?error=processing_failed", status_code=302
        )

    # Process user - Complete implementation
    email = user_info.get("email")
    if not email:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}?error=no_email", status_code=302
        )

    try:
        is_new_user = False
        user = user_crud.get_user_by_email(db, email=email)

        if not user:

            is_new_user = True  # <--- mark as new
            # Generate a secure random password since DB requires it
            random_password = secrets.token_urlsafe(24)
            user_in = user_schemas.UserCreate(
                email=email,
                name=user_info.get("name", ""),
                password=random_password,
                role="jobseeker",  # temp default
            )
            user = user_crud.create_user(db, user_in, role="jobseeker")
            jwt_access_token = security.create_access_token(
                data={"sub": user.email, "role": user.role}
            )
        else:
            logger.info(f"Found existing user with ID: {user.id}")
            pass
            # Create JWT token for authentication
            jwt_access_token = security.create_access_token(
                data={"sub": user.email, "role": user.role}
            )
        logger.info("JWT token created successfully")

        # build redirect url
        # After successful OAuth, redirect all users through /oauth-redirect

        if is_new_user:
            redirect_url = (
                f"{settings.FRONTEND_URL}/oauth-redirect?success=oauth_login&new_user=1"
            )
        else:
            redirect_url = f"{settings.FRONTEND_URL}/oauth-redirect?success=oauth_login"

        # Create redirect response with authentication cookie
        response = RedirectResponse(
            url=redirect_url, status_code=302
        )  # moves user from backend back to website
        response.set_cookie(
            key="access_token",
            value=jwt_access_token,
            httponly=True,  # Prevents client-side JavaScript from accessing the cookie
            samesite="lax",
            secure=False,  # Set to True in production with HTTPS
            max_age=3600 * 24 * 7,  # 7 days
            domain=None,  # Don't set domain to allow localhost
            path="/",  # Cookie valid for entire domain
        )

        # Clear OAuth state from session
        if "oauth_state" in request.session:
            del request.session["oauth_state"]

        logger.info("OAuth login completed successfully - user authenticated")
        return response

    except Exception as e:
        logger.error(f"Database/JWT error: {e}", exc_info=True)
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}?error=login_processing_failed",
            status_code=302,
        )


# Regular login/register endpoints
@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Handles user registration with email and password."""
    user = user_crud.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = user_crud.create_user(db, user_in, role=user_in.role)
    return user


@router.post("/login")
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticates user with email and password and returns a JWT."""
    user = user_crud.authenticate_user(
        db, email=user_in.email, password=user_in.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    response = JSONResponse(content={"message": "Login successful", "role": user.role})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,  # True in production with HTTPS
        max_age=3600*24*7,
        path="/",
    )

    return response


@router.get("/me")
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Get current authenticated user info"""
    # Try to get token from cookie first
    token = request.cookies.get("access_token")

    if not token:
        # Try authorization header as fallback
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        # Verify the JWT token
        payload = security.decode_access_token(token)
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Get user from database
        user = user_crud.get_user_by_email(db, email=email)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "authenticated": True,
        }
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/logout")
async def logout():
    """Logout user by clearing the authentication cookie"""
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie(key="access_token")
    return response


@router.post("/set-role")
def set_role(role_update: RoleUpdate, request: Request, db: Session = Depends(get_db)):
    """Allow a logged-in user to set their role after OAuth"""
    allowed_roles = ["jobseeker", "employer"]  # don’t allow 'admin' here

    if role_update.role not in allowed_roles:
        raise HTTPException(status_code=400, detail="Invalid role")

        # Debug logging
    logger.info("=== SET ROLE DEBUG ===")
    logger.info(f"Cookies received: {dict(request.cookies)}")
    logger.info(f"Authorization header: {request.headers.get('authorization', 'None')}")

    # Get user from token in cookie/header
    token = request.cookies.get("access_token")

    if not token:
        logger.info("No cookie token, checking Authorization header...")
        # Try Authorization header for email registration
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        logger.error("No token found in cookies or Authorization header")
        raise HTTPException(status_code=401, detail="Not authenticated")

    logger.info(f"Token found: {token[:20]}...")
    try:
        payload = security.decode_access_token(token)
        email = payload.get("sub")
        logger.info(f"Token verified for email: {email}")
        user = user_crud.get_user_by_email(db, email=email)
        if not user:
            logger.error(f"User not found for email: {email}")
            raise HTTPException(status_code=404, detail="user not found")

        # update role
        user.role = role_update.role
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"Role updated for user {email}: {role_update.role}")
        return {"message": "Role uploaded", "role": user.role}
    except Exception as e:
        logger.error(f"Role update failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")
