import os
import shutil
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Form, Request, status, File, UploadFile
from sqlalchemy.orm import Session

from app.schemas.timeline import TimelineEventOut, TimelineEventCreate, TimelineEventUpdate
from app.crud.timeline import list_events, get_event, create_event, update_event, delete_event
from app.database import get_db

router = APIRouter(prefix="/timeline", tags=["timeline"])

# --- YENİ EKLENEN KISIM: Klasör Ayarı ---
UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[TimelineEventOut])
def list_timeline(db: Session = Depends(get_db)):
    return list_events(db)

@router.get("/{event_id}", response_model=TimelineEventOut)
def get_timeline_item(event_id: int, db: Session = Depends(get_db)):
    obj = get_event(db, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Timeline event not found")
    return obj

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=TimelineEventOut,
)
async def create_timeline_item(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    date_label: str = Form(...),
    image_url: Optional[str] = Form(None), # Manuel link girilirse
    file: Optional[UploadFile] = File(None), # YENİ: Dosya seçilirse
    db: Session = Depends(get_db),
):
    final_image_url = image_url

    # --- YENİ EKLENEN KISIM: Dosya Kaydetme ---
    if file:
        # Uzantıyı al (jpg, png vs)
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        # Benzersiz isim oluştur
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        # Dosyayı kaydet
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Veritabanına yazılacak yol
        final_image_url = f"/public/uploads/{unique_filename}"
    # -------------------------------------------

    payload = TimelineEventCreate(
        title=title,
        description=description,
        category=category,
        date_label=date_label,
        image_url=final_image_url # Güncellenmiş URL'yi kullan
    )
    # create_event fonksiyonun yapısına göre image_url'i payload içinde mi 
    # yoksa ayrı parametre olarak mı aldığına dikkat et. 
    # Senin kodunda 'create_event(db, payload, image_url=...)' şeklindeydi:
    return create_event(db, payload, image_url=final_image_url)


@router.put(
    "/{event_id}",
    response_model=TimelineEventOut,
)
async def update_timeline_item(
    event_id: int,
    request: Request,
    # Form ile güncelleme parametreleri
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    date_label: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None), # YENİ: Update için dosya
    db: Session = Depends(get_db),
):
    obj = get_event(db, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Timeline event not found")

    # --- YENİ EKLENEN KISIM: Dosya varsa işle ---
    final_image_url = image_url
    if file:
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        final_image_url = f"/public/uploads/{unique_filename}"
    # -------------------------------------------

    ct = (request.headers.get("content-type") or "").lower()

    # JSON body ile güncelleme (Eski yöntem - Postman vb için)
    if ct.startswith("application/json"):
        data = await request.json()
        updates = TimelineEventUpdate(**data)
        return update_event(db, obj, updates, image_url=None)

    # Form Data ile güncelleme
    updates = TimelineEventUpdate(
        title=title,
        description=description,
        category=category,
        date_label=date_label,
        image_url=final_image_url, 
    )
    return update_event(db, obj, updates, image_url=None)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_timeline_item(event_id: int, db: Session = Depends(get_db)):
    obj = get_event(db, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Timeline event not found")
    delete_event(db, obj)
    return None