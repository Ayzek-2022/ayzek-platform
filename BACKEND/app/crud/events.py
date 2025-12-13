from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Event
from app.schemas.events import EventCreate, EventUpdate
from datetime import datetime as dt

def get_event(db: Session, event_id: int) -> Optional[Event]:
    return db.query(Event).filter(Event.id == event_id).first()

def get_event_by_slug(db: Session, slug: str) -> Optional[Event]:
    return db.query(Event).filter(Event.slug == slug).first()

def get_events(db: Session, skip: int = 0, limit: int = 100) -> List[Event]:
    return (
        db.query(Event)
        .order_by(Event.start_at.desc())
        .offset(skip).limit(limit).all()
    )

def get_upcoming_events(db: Session, limit: int = 3) -> List[Event]:
    return (
        db.query(Event)
        .order_by(Event.start_at.asc())
        .limit(limit)
        .all()
    )

def _unique_slug(db: Session, slug: str) -> str:
    exists = db.query(Event.id).filter(Event.slug == slug).first()
    if not exists:
        return slug
    return f"{slug}-{int(dt.utcnow().timestamp())}"

def create_event(db: Session, payload: EventCreate) -> Event:
    ev = Event(
        title=payload.title,
        description=payload.description,
        cover_image_url=str(payload.cover_image_url),
        start_at=payload.start_at,
        location=payload.location,
        category=payload.category,
        capacity=payload.capacity,
        registered=0,
        whatsapp_link=str(payload.whatsapp_link),
        slug=_unique_slug(db, payload.slug),
        tags=(payload.tags or "").strip(),
        created_at=dt.utcnow(),
        updated_at=dt.utcnow(),
    )
    db.add(ev)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise
    db.refresh(ev)
    return ev

ALLOWED_UPDATE_FIELDS = {
    "title","description","cover_image_url","start_at","location",
    "category","capacity","whatsapp_link","slug","tags"
}

def update_event(db: Session, event_id: int, payload: EventUpdate) -> Optional[Event]:
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        return None
    for k, v in payload.dict(exclude_unset=True).items():
        if k in ALLOWED_UPDATE_FIELDS:
            setattr(ev, k, v)
    ev.updated_at = dt.utcnow()
    db.commit()
    db.refresh(ev)
    return ev

def delete_event(db: Session, event_id: int) -> Optional[Event]:
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        return None
    db.delete(ev)
    db.commit()
    return ev
