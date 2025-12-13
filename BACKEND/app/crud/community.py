from sqlalchemy.orm import Session
from typing import List, Optional

from app import models
from app.schemas.community import (
    CommunityApplicationCreate,
)


def create_application(db: Session, data: CommunityApplicationCreate) -> models.CommunityApplication:
    obj = models.CommunityApplication(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def list_applications(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    q: Optional[str] = None,  # ad/soyad/email arama
) -> List[models.CommunityApplication]:
    query = db.query(models.CommunityApplication).order_by(models.CommunityApplication.created_at.desc())

    if status:
        query = query.filter(models.CommunityApplication.status == status)

    if q:
        like = f"%{q}%"
        query = query.filter(
            (models.CommunityApplication.first_name.ilike(like)) |
            (models.CommunityApplication.last_name.ilike(like)) |
            (models.CommunityApplication.email.ilike(like))
        )

    return query.offset(skip).limit(limit).all()


def get_application(db: Session, app_id: int) -> Optional[models.CommunityApplication]:
    return db.query(models.CommunityApplication).filter(models.CommunityApplication.id == app_id).first()


def update_status(db: Session, app_id: int, status: str) -> Optional[models.CommunityApplication]:
    obj = get_application(db, app_id)
    if not obj:
        return None
    obj.status = status  # enum FastAPI tarafında valid edildi
    db.commit()
    db.refresh(obj)
    return obj


def delete_application(db: Session, app_id: int) -> bool:
    obj = get_application(db, app_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
