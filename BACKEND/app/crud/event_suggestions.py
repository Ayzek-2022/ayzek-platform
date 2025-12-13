from typing import List, Tuple, Optional, Union
from sqlalchemy.orm import Session

from app import models
from app.schemas import event_suggestions as schemas


def create_suggestion(db: Session, data: schemas.EventSuggestionCreate) -> models.EventSuggestion:
    """Yeni öneri oluşturur."""
    obj = models.EventSuggestion(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def list_suggestions(db: Session, skip: int = 0, limit: int = 50) -> Tuple[List[models.EventSuggestion], int]:
    """Önerileri sayfalı döndürür (son eklenen ilk gelir)."""
    q = db.query(models.EventSuggestion).order_by(models.EventSuggestion.created_at.desc())
    total = q.count()
    items = q.offset(skip).limit(limit).all()
    return items, total


def get_suggestion(db: Session, suggestion_id: int) -> Optional[models.EventSuggestion]:
    """Tek öneriyi getirir."""
    # SQLAlchemy 2.0: Session.get(Model, pk)
    return db.get(models.EventSuggestion, suggestion_id)


def update_status(
    db: Session,
    suggestion_id: int,
    new_status: Union[str, models.SuggestionStatus],
) -> Optional[models.EventSuggestion]:
    """Öneri durumunu günceller. Geçersiz durum gelirse None döner."""
    obj = db.get(models.EventSuggestion, suggestion_id)
    if not obj:
        return None

    try:
        status_enum = (
            models.SuggestionStatus(new_status)
            if isinstance(new_status, str)
            else new_status
        )
    except ValueError:
        # Geçersiz durum
        db.rollback()
        return None

    obj.status = status_enum
    db.commit()
    db.refresh(obj)
    return obj


def delete_suggestion(db: Session, suggestion_id: int) -> bool:
    """Öneriyi siler."""
    obj = db.get(models.EventSuggestion, suggestion_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
