from typing import Sequence
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models import Poster
from app.schemas.poster import PosterCreate, PosterUpdate

def get(db: Session, poster_id: int) -> Poster | None:
    return db.query(Poster).filter(Poster.id == poster_id).first()

def get_multi(db: Session, skip: int = 0, limit: int = 100, active: bool | None = None) -> Sequence[Poster]:
    q = db.query(Poster)
    if active is not None:
        q = q.filter(Poster.is_active == active)
    # İlk eklenen en solda, son eklenen en sağda:
    q = q.order_by(
        Poster.order_index.asc().nulls_last(),  # temel sıra
        Poster.id.asc(),                        # stabilite
    )
    return q.offset(skip).limit(limit).all()

def create(db: Session, obj_in: PosterCreate) -> Poster:
    # order_index gönderilmemişse → en sona (max+1)
    if obj_in.order_index is None:
        max_idx = db.query(func.coalesce(func.max(Poster.order_index), 0)).scalar()
        next_idx = int(max_idx) + 1
    else:
        next_idx = obj_in.order_index

    db_obj = Poster(
        title=obj_in.title,
        subtitle=obj_in.subtitle,
        content=obj_in.content,
        image_url=obj_in.image_url,
        is_active=obj_in.is_active if obj_in.is_active is not None else True,
        order_index=next_idx,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, db_obj: Poster, obj_in: PosterUpdate) -> Poster:
    if obj_in.title is not None:
        db_obj.title = obj_in.title
    if obj_in.subtitle is not None:
        db_obj.subtitle = obj_in.subtitle
    if obj_in.content is not None:
        db_obj.content = obj_in.content
    if obj_in.image_url is not None:
        db_obj.image_url = obj_in.image_url
    if obj_in.is_active is not None:
        db_obj.is_active = obj_in.is_active
    if obj_in.order_index is not None:
        db_obj.order_index = obj_in.order_index

    db.commit()
    db.refresh(db_obj)
    return db_obj

def remove(db: Session, poster_id: int) -> None:
    db_obj = get(db, poster_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
