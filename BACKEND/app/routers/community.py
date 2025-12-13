from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.schemas.community import (
    CommunityApplicationCreate,
    CommunityApplicationResponse,
    CommunityApplicationStatusUpdate,
)
from app.crud.community import (
    create_application,
    list_applications,
    get_application,
    update_status,
    delete_application,
)

router = APIRouter(prefix="/community", tags=["Community"])


# ---- Public: Başvuru oluştur ----
@router.post(
    "/apply",
    response_model=CommunityApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply(payload: CommunityApplicationCreate, db: Session = Depends(get_db)):
    try:
        obj = create_application(db, payload)
        return obj
    except Exception:
        # ör: DB hatası vs.
        raise HTTPException(status_code=400, detail="Başvuru kaydedilemedi.")


# ---- Admin: Listele ----
@router.get(
    "/applications",
    response_model=list[CommunityApplicationResponse],
)
def admin_list_applications(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = Query(100, le=500),
    status: str | None = Query(None, description="pending/reviewed/accepted/rejected"),
    q: str | None = Query(None, description="Ad, soyad veya e-posta araması"),
):
    return list_applications(db, skip=skip, limit=limit, status=status, q=q)


# ---- Admin: Detay ----
@router.get(
    "/applications/{app_id}",
    response_model=CommunityApplicationResponse,
)
def admin_get_application(app_id: int, db: Session = Depends(get_db)):
    obj = get_application(db, app_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı.")
    return obj


# ---- Admin: Durum Güncelle ----
@router.patch(
    "/applications/{app_id}/status",
    response_model=CommunityApplicationResponse,
)
def admin_update_status(app_id: int, payload: CommunityApplicationStatusUpdate, db: Session = Depends(get_db)):
    if payload.status not in {"pending", "reviewed", "accepted", "rejected"}:
        raise HTTPException(status_code=400, detail="Geçersiz durum.")
    obj = update_status(db, app_id, payload.status)
    if not obj:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı.")
    return obj


# ---- Admin: Sil (opsiyonel) ----
@router.delete(
    "/applications/{app_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def admin_delete_application(app_id: int, db: Session = Depends(get_db)):
    ok = delete_application(db, app_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı.")
    return None
