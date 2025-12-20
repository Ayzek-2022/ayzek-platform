import os
import shutil
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import gallery_events as crud
from app.schemas.gallery_events import (
    GalleryEventOut,
    GalleryEventCreate,
    GalleryEventUpdate,
)

# Prefix senin kodunda /api/gallery-events idi, aynen koruyoruz.
router = APIRouter(prefix="/api/gallery-events", tags=["gallery-events"])

# Resimlerin kaydedileceği klasör
UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[GalleryEventOut])
def list_events(db: Session = Depends(get_db)):
    return crud.list_gallery_events(db)

@router.get("/{event_id}", response_model=GalleryEventOut)
def retrieve_event(event_id: int, db: Session = Depends(get_db)):
    obj = crud.get_gallery_event(db, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Event not found")
    return obj

# --- YENİ: DOSYA DESTEKLİ CREATE ---
@router.post("", response_model=GalleryEventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    date: str = Form(...),     
    location: str = Form(...),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None), # Dosya parametresi
    db: Session = Depends(get_db)
):
    final_image_url = image_url

    # Dosya yüklendiyse kaydet
    if file:
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        final_image_url = f"/public/uploads/{unique_filename}"

    # Pydantic modelini oluştur
    payload = GalleryEventCreate(
        title=title,
        description=description,
        category=category,
        date=date,
        location=location,
        image_url=final_image_url
    )
    return crud.create_gallery_event(db, payload)

# --- YENİ: DOSYA DESTEKLİ UPDATE ---
@router.put("/{event_id}", response_model=GalleryEventOut)
async def update_event(
    event_id: int,
    request: Request,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    date: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Önce kaydın var olup olmadığını kontrol edelim (crud fonksiyonun içinde kontrol yoksa burada patlamasın diye)
    existing_obj = crud.get_gallery_event(db, event_id)
    if not existing_obj:
        raise HTTPException(status_code=404, detail="Event not found")

    final_image_url = image_url

    # Yeni dosya varsa kaydet
    if file:
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        final_image_url = f"/public/uploads/{unique_filename}"

    ct = (request.headers.get("content-type") or "").lower()

    # JSON Body desteği (Eski yöntem/Postman testleri için)
    if ct.startswith("application/json"):
        data = await request.json()
        payload = GalleryEventUpdate(**data)
        updated_obj = crud.update_gallery_event(db, event_id, payload)
        return updated_obj

    # Form Data desteği
    payload = GalleryEventUpdate(
        title=title,
        description=description,
        category=category,
        date=date,
        location=location,
        image_url=final_image_url
    )
    
    updated_obj = crud.update_gallery_event(db, event_id, payload)
    if not updated_obj:
         raise HTTPException(status_code=404, detail="Event not found")
    return updated_obj

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_gallery_event(db, event_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Event not found")