from fastapi import APIRouter, Depends, Request
from authlib.integrations.starlette_client import OAuth
from starlette.responses import RedirectResponse
from app.core import config

# Create a router object for authentication-related routes
router = APIRouter()
# Initializes the Authlib OAuth object
oauth=OAuth()

# Registers the "google" OAuth client with Authlib
oauth.register(
    name="google",
    client_id=config.GOOGLE_CLIENT_ID,
    client_secret=config.GOOGLE_CLIENT_SECRET,
    # Google's discovery document URL to fetch provider details automatically
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    # Defines the user data your app requests (email, profile info)
    client_kwargs={"scope": "openid email profile"}
)

# Define the endpoint for initiating the Google login process.
@router.get("/login/google")
async def login_via_google(request: Request):
    redirect_uri = config.GOOGLE_REDIRECT_URL
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def auth_google_callback(request: Request):
    # authorize_access_token() exchanges that code for an access token + ID token.
    token = await oauth.google.authorize_access_token(request)
    # parse_id_token() extracts user information from the ID token.
    user_info = await oauth.google.parse_id_token(request, token)
    return {"user":user_info}

