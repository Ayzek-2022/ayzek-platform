from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import Event
from app.schemas.events import EventCreate, EventUpdate

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
        .filter(Event.start_at >= func.now())
        .order_by(Event.start_at.asc())
        .limit(limit)
        .all()
    )

def create_event(db: Session, payload: EventCreate) -> Event:
    ev = Event(**payload.dict())
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev

def update_event(db: Session, event_id: int, payload: EventUpdate) -> Optional[Event]:
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        return None
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(ev, k, v)
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