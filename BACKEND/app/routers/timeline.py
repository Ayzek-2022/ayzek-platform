from fastapi import APIRouter, Depends, HTTPException, Form, Request, status
from sqlalchemy.orm import Session

from app.schemas.timeline import TimelineEventOut, TimelineEventCreate, TimelineEventUpdate
from app.crud.timeline import list_events, get_event, create_event, update_event, delete_event
from app.database import get_db  # kendi yolun

router = APIRouter(prefix="/timeline", tags=["timeline"])


@router.get("", response_model=list[TimelineEventOut])
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
    image_url: str | None = Form(None),   # <-- DOSYA YOK, METİN (URL)
    db: Session = Depends(get_db),
):
    payload = TimelineEventCreate(
        title=title,
        description=description,
        category=category,
        date_label=date_label,
    )
    return create_event(db, payload, image_url=image_url or None)


@router.put(
    "/{event_id}",
    response_model=TimelineEventOut,
)
async def update_timeline_item(
    event_id: int,
    request: Request,
    # JSON veya FORM ile güncelleme (hepsi metin alanı)
    title: str | None = Form(None),
    description: str | None = Form(None),
    category: str | None = Form(None),
    date_label: str | None = Form(None),
    image_url: str | None = Form(None),   # <-- metin (URL)
    db: Session = Depends(get_db),
):
    obj = get_event(db, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Timeline event not found")

    ct = (request.headers.get("content-type") or "").lower()

    # JSON body ile güncelleme
    if ct.startswith("application/json"):
        data = await request.json()
        updates = TimelineEventUpdate(**data)
        # JSON’da image_url geldiyse o değer updates.image_url içinde olur
        return update_event(db, obj, updates, image_url=None)

    # Form ile güncelleme
    updates = TimelineEventUpdate(
        title=title,
        description=description,
        category=category,
        date_label=date_label,
        image_url=image_url,  # burada direkt image_url set ediyoruz
    )
    return update_event(db, obj, updates, image_url=None)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_timeline_item(event_id: int, db: Session = Depends(get_db)):
    obj = get_event(db, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Timeline event not found")
    delete_event(db, obj)
    return None
