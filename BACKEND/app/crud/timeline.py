from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from app.schemas.timeline import (
    TimelineEventCreate,
    TimelineEventUpdate,
)
from app.models import TimelineEvents  # gerekli ise yolunu değiştir: app.models.models import TimelineEvents


def list_events(db: Session) -> List[TimelineEvents]:
    return db.query(TimelineEvents).order_by(TimelineEvents.id.desc()).all()


def get_event(db: Session, event_id: int) -> Optional[TimelineEvents]:
    return db.query(TimelineEvents).filter(TimelineEvents.id == event_id).first()


def create_event(
    db: Session, data: TimelineEventCreate, image_url: Optional[str] = None
) -> TimelineEvents:
    obj = TimelineEvents(
        title=data.title,
        description=data.description,
        category=data.category,
        date_label=data.date_label,
        image_url=image_url or "",
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_event(
    db: Session, event: TimelineEvents, updates: TimelineEventUpdate, image_url: Optional[str] = None
) -> TimelineEvents:
    data: Dict[str, Any] = updates.model_dump(exclude_unset=True)
    if image_url is not None:
        data["image_url"] = image_url

    for k, v in data.items():
        setattr(event, k, v)

    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def delete_event(db: Session, event: TimelineEvents) -> None:
    db.delete(event)
    db.commit()
