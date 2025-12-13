# app/security.py
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
import os

from .database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- ENV ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_IN_PROD")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

if SECRET_KEY == "CHANGE_ME_IN_PROD":
    print("UYARI: JWT_SECRET_KEY .env'den okunamadı, varsayılan kullanılıyor!")

# Swagger/Deps için HTTPBearer
bearer = HTTPBearer(auto_error=True)  # auto_error=True olsun; 401 düzgün dönsün

# --- PASSWORD ---
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# --- JWT ---
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

# --- DEPENDENCIES ---
def require_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Provide Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("sub")
    # Eğer DB'de Admin tablosu yoksa/tokensal yetki kullanacaksanız
    # token claim'leri ile de admin yetkisi verebilirsiniz:
    is_admin_claim = payload.get("is_admin") is True or payload.get("role") in {"admin", "superadmin"}

    # DB kontrolü (varsa)
    try:
        from .models import Admin  # lazy import
        admin = db.query(Admin).filter(Admin.email == email).first()
    except Exception:
        admin = None  # Admin modeli yoksa claim'e düşeriz

    if not admin and not is_admin_claim:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")

    # Geri dönen obje: DB'de admin varsa onu, yoksa payload'ı döndür.
    return admin or {"sub": email, **payload}

# Router'ların beklediği isim:
def get_current_admin(admin = Depends(require_admin)):
    return admin
