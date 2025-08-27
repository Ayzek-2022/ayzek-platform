from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.timeline import TimelineEventOut
from app.crud.timeline import list_timeline

router = APIRouter(prefix="/timeline", tags=["Timeline"])

@router.get("", response_model=list[TimelineEventOut])
def read_timeline(db: Session = Depends(get_db)):
    return list_timeline(db)
