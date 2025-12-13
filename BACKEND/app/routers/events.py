from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.events import Event, EventCreate, EventUpdate
from app.crud import events as crud_events

router = APIRouter()

@router.post("", response_model=Event, status_code=status.HTTP_201_CREATED)
def create_event(payload: EventCreate, db: Session = Depends(get_db)):
    return crud_events.create_event(db, payload)

@router.get("", response_model=List[Event])
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_events.get_events(db, skip, limit)

@router.get("/upcoming", response_model=List[Event])
def get_upcoming_events(limit: int = 1000, db: Session = Depends(get_db)):
    return crud_events.get_upcoming_events(db, limit)

@router.get("/slug/{slug}", response_model=Event)
def get_event_by_slug(slug: str, db: Session = Depends(get_db)):
    event = crud_events.get_event_by_slug(db, slug)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return event

@router.get("/{event_id}", response_model=Event)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = crud_events.get_event(db, event_id)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return event

@router.put("/{event_id}", response_model=Event)
def update_event(event_id: int, payload: EventUpdate, db: Session = Depends(get_db)):
    event = crud_events.update_event(db, event_id, payload)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return event

@router.delete("/{event_id}", response_model=Event)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = crud_events.delete_event(db, event_id)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return event