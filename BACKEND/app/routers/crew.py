# routers/crew.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict

from ..database import get_db
from ..crud import crew as crud
from ..schemas.crew import CrewMemberCreate, CrewMemberRead, CrewMemberUpdate
from ..models import CrewMember  # Silme ve güncelleme için modeli de import ediyoruz

router = APIRouter(
    prefix="/crew",
    tags=["Crew Members"]
)

@router.get("/", response_model=Dict[str, List[CrewMemberRead]], summary="Tüm ekip üyelerini kategorilere göre gruplanmış getirir.")
def read_all_crew_members(db: Session = Depends(get_db)):
    """
    Tüm ekip üyelerini `{ "Başkan ve Yardımcılar": [...], "Sosyal Medya": [...] }` formatında döndürür.
    """
    return crud.get_all_crew_members_grouped(db=db)

@router.post("/", response_model=CrewMemberRead, status_code=status.HTTP_201_CREATED, summary="Yeni bir ekip üyesi oluşturur (Admin).")
def create_crew_member(member: CrewMemberCreate, db: Session = Depends(get_db)):
    return crud.create_crew_member(db=db, member=member)

@router.put("/{member_id}", response_model=CrewMemberRead, summary="Bir ekip üyesini günceller (Admin).")
def update_crew_member(member_id: int, member_update: CrewMemberUpdate, db: Session = Depends(get_db)):
    db_member = db.query(CrewMember).filter(CrewMember.id == member_id).first()
    if db_member is None:
        raise HTTPException(status_code=404, detail="Ekip üyesi bulunamadı")
    updated = crud.update_crew_member(db=db, member_id=member_id, member_update=member_update)
    if updated is None:
        raise HTTPException(status_code=404, detail="Ekip üyesi bulunamadı")
    return updated

@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Bir ekip üyesini siler (Admin).")
def delete_crew_member(member_id: int, db: Session = Depends(get_db)):
    success = crud.delete_crew_member(db=db, member_id=member_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ekip üyesi bulunamadı")
    return {"ok": True}
