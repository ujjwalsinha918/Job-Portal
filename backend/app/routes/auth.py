from fastapi import APIRouter, Depends, Request, HTTPException
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
import secrets # to generate a secure random password

from app.core.config import settings
from app.core import config, security
from app.core.database import get_db
from app.crud import users as user_crud
from app.schemas import user as user_schemas
from app.utils.hash import hash_password  # your password util


router = APIRouter()
oauth = OAuth()

# Register Google OAuth
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"}
)


@router.get("/login/google")
async def login_via_google(request: Request):
    # builds the correct Google Login URL and sends the user’s browser there
    redirect_uri = config.GOOGLE_REDIRECT_URL  # e.g., http://localhost:8000/auth/google/callback
    # After login, Google sends them back to your callback URL (/auth/google/callback)
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/auth/google/callback")
async def auth_google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        # Exchange code for token
        token = await oauth.google.authorize_access_token(request)
        # Extract user info
        user_info = await oauth.google.parse_id_token(request, token)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Google authentication failed")
    


    # for login 
    # 1) Lookup user in DB by email
    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google did not return an email")

    user = user_crud.get_user_by_email(db, email=email)

    # 2) If user doesn't exist -> create one (default role = jobseeker)
    if not user:
        # generate a secure random password because DB requires it
        random_password = secrets.token_urlsafe(24)
        user_in = user_schemas.UserCreate(
            email=email,
            name=user_info.get("name", ""),
            password=random_password
        )
        user = user_crud.create_user(db, user_in, role="jobseeker")

    # 3) Create our own JWT for the application (so frontend calls our APIs with it)
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role}
    )

    # 4) Redirect to frontend and set httponly cookie for session
    response = RedirectResponse(url=config.settings.FRONTEND_URL, status_code=303)
    # set cookie securely: consider add secure=True if using HTTPS in production
    response.set_cookie(key="access_token", value=access_token, httponly=True, samesite="lax", secure=True)
    return response