# backend/app/routers/blogs.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from app.database import get_db  # sende nasıl ise öyle import et
from app.schemas.blog import BlogOut, BlogCreate, BlogUpdate
from app.crud.blog import list_blogs, get_blog, create_blog, update_blog, delete_blog

router = APIRouter(prefix="/blogs", tags=["blogs"])

@router.get("", response_model=Dict[str, Any])
def api_list_blogs(
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db),
):
    items, total = list_blogs(db, q=q, category=category, page=page, page_size=page_size)
    return {"items": [BlogOut.model_validate(i) for i in items], "total": total, "page": page, "page_size": page_size}

@router.get("/{blog_id}", response_model=BlogOut)
def api_get_blog(blog_id: int, db: Session = Depends(get_db)):
    obj = get_blog(db, blog_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Blog bulunamadı")
    return BlogOut.model_validate(obj)

@router.post("", response_model=BlogOut, status_code=201)
def api_create_blog(payload: BlogCreate, db: Session = Depends(get_db)):
    obj = create_blog(db, payload)
    return BlogOut.model_validate(obj)

@router.put("/{blog_id}", response_model=BlogOut)
def api_update_blog(blog_id: int, payload: BlogUpdate, db: Session = Depends(get_db)):
    obj = update_blog(db, blog_id, payload)
    if not obj:
        raise HTTPException(status_code=404, detail="Blog bulunamadı")
    return BlogOut.model_validate(obj)

@router.delete("/{blog_id}", status_code=204)
def api_delete_blog(blog_id: int, db: Session = Depends(get_db)):
    ok = delete_blog(db, blog_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Blog bulunamadı")
    return None
