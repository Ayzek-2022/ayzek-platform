from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Admin as AdminModel
from ..schemas.admin_login import AdminLogin
from ..security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    require_admin,
    verify_password,
)

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/login")
def login_admin(credentials: AdminLogin, db: Session = Depends(get_db)):
    admin_user = db.query(AdminModel).filter(AdminModel.email == credentials.email).first()
    if not admin_user or not verify_password(credentials.password, admin_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz e-posta veya şifre",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        data={"sub": admin_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "admin_info": {"id": admin_user.id, "email": admin_user.email},
    }

@router.get("/me")
def get_me(current_admin: AdminModel = Depends(require_admin)):
    return {"id": current_admin.id, "email": current_admin.email}

@router.post("/logout")
def logout(current_admin: AdminModel = Depends(require_admin)):
    # Token client tarafında silinir.
    return {"message": "Başarıyla çıkış yapıldı"}

@router.get("/dashboard")
def dashboard(current_admin: AdminModel = Depends(require_admin)):
    return {"message": f"Hoşgeldiniz {current_admin.email}",
            "dashboard_data": {"total_users": 150, "total_events": 25, "total_posts": 78}}
