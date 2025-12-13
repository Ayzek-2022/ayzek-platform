# backend/app/crud/blog.py
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select, desc, or_, func
from app.models import Blog
from app.schemas.blog import BlogCreate, BlogUpdate

def list_blogs(
    db: Session,
    q: Optional[str] = None,
    category: Optional[str] = None,
    page: int = 1,
    page_size: int = 12,
) -> Tuple[List[Blog], int]:
    stmt = select(Blog)
    if category:
        stmt = stmt.where(Blog.category == category)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Blog.title.ilike(like), Blog.preview.ilike(like), Blog.content.ilike(like)))
    total = db.scalar(select(func.count()).select_from(stmt.subquery()))  # toplam
    stmt = stmt.order_by(desc(Blog.date), desc(Blog.id)).offset((page - 1) * page_size).limit(page_size)
    rows = db.execute(stmt).scalars().all()
    return rows, (total or 0)

def get_blog(db: Session, blog_id: int) -> Optional[Blog]:
    return db.get(Blog, blog_id)

def create_blog(db: Session, data: BlogCreate) -> Blog:
    obj = Blog(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_blog(db: Session, blog_id: int, data: BlogUpdate) -> Optional[Blog]:
    obj = db.get(Blog, blog_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_blog(db: Session, blog_id: int) -> bool:
    obj = db.get(Blog, blog_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
