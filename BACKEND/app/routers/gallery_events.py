from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import gallery_events as crud
# 🔧 Doğrudan dosyadan import
from app.schemas.gallery_events import (
    GalleryEventOut,
    GalleryEventCreate,
    GalleryEventUpdate,
)

router = APIRouter(prefix="/api/gallery-events", tags=["gallery-events"])

@router.get("", response_model=list[GalleryEventOut])
def list_events(db: Session = Depends(get_db)):
    return crud.list_gallery_events(db)

@router.get("/{event_id}", response_model=GalleryEventOut)
def retrieve_event(event_id: int, db: Session = Depends(get_db)):
    obj = crud.get_gallery_event(db, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Event not found")
    return obj

@router.post("", response_model=GalleryEventOut, status_code=status.HTTP_201_CREATED)
def create_event(payload: GalleryEventCreate, db: Session = Depends(get_db)):
    return crud.create_gallery_event(db, payload)

@router.put("/{event_id}", response_model=GalleryEventOut)
def update_event(event_id: int, payload: GalleryEventUpdate, db: Session = Depends(get_db)):
    obj = crud.update_gallery_event(db, event_id, payload)
    if not obj:
        raise HTTPException(status_code=404, detail="Event not found")
    return obj

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_gallery_event(db, event_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Event not found")

