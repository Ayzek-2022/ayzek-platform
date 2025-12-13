from sqlalchemy.orm import Session
from app import models
# 🔧 Doğrudan dosyadan import — paket __init__ gerektirmez
from app.schemas.gallery_events import GalleryEventCreate, GalleryEventUpdate

def list_gallery_events(db: Session):
    return (
        db.query(models.GalleryEvent)
        .order_by(models.GalleryEvent.date.desc())
        .all()
    )

def get_gallery_event(db: Session, event_id: int):
    # SQLAlchemy 2 tarzı .get
    return db.get(models.GalleryEvent, event_id)

def create_gallery_event(db: Session, data: GalleryEventCreate):
    obj = models.GalleryEvent(**data.model_dump())  # pydantic v2
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_gallery_event(db: Session, event_id: int, data: GalleryEventUpdate):
    obj = get_gallery_event(db, event_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_gallery_event(db: Session, event_id: int) -> bool:
    obj = get_gallery_event(db, event_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
