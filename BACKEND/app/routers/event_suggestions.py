from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas import event_suggestions as schemas
from app.crud import event_suggestions as crud

router = APIRouter(prefix="/event-suggestions", tags=["Event Suggestions"])


# Kullanıcı: öneri gönder
@router.post("", response_model=schemas.EventSuggestionOut, status_code=status.HTTP_201_CREATED)
def create_suggestion(payload: schemas.EventSuggestionCreate, db: Session = Depends(get_db)):
    # payload sadece: title, description, contact
    return crud.create_suggestion(db, payload)


# Admin: listele (basit pagination)
@router.get("", response_model=List[schemas.EventSuggestionOut])
def list_suggestions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    items, _total = crud.list_suggestions(db, skip, limit)
    return items


# Admin: tek kayıt
@router.get("/{suggestion_id}", response_model=schemas.EventSuggestionOut)
def get_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    obj = crud.get_suggestion(db, suggestion_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Öneri bulunamadı")
    return obj


# Admin: durum güncelle
@router.patch("/{suggestion_id}/status", response_model=schemas.EventSuggestionOut)
def set_status(suggestion_id: int, payload: schemas.EventSuggestionStatusUpdate, db: Session = Depends(get_db)):
    updated = crud.update_status(db, suggestion_id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Öneri bulunamadı")
    return updated


# Admin: sil
@router.delete("/{suggestion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_suggestion(db, suggestion_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Öneri bulunamadı")
    return None  # 204: gövde yok
