from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from app.core.config import settings
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    """
    Create a JWT access token containing `data` (e.g. sub, role).
    """
    to_encode = data.copy() # copy to avoid mutating the caller’s dict
    # Add standard `exp` claim (JWT expiry timestamp)
    to_encode.update({"exp": expire, "iat": now})

    # Actually sign + encode JWT using your secret and algorithm (e.g., HS256) 
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")  # Raise instead of return None
