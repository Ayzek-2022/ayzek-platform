# routers/teams.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..crud import teams as crud
# YENİ EKLENDİ: TeamUpdate şemasını import et
from ..schemas.teams import TeamRead, TeamCreate, TeamUpdate

router = APIRouter(prefix="/teams", tags=["teams"])


# --- Public Rotalar (GET) ---

@router.get("/featured", response_model=List[TeamRead], summary="Anasayfa için öne çıkan (featured) takımları getir.")
def read_featured_teams(db: Session = Depends(get_db)):
    """Anasayfada gösterilmek üzere öne çıkarılmış (is_featured=True) ilk 4 takımı getirir."""
    return crud.get_featured_teams(db=db, limit=4)

@router.get("", response_model=List[TeamRead], summary="Tüm takımları üyeleriyle birlikte getir.")
def read_all_teams(db: Session = Depends(get_db)):
    """Tüm takımları, takım listesi sayfası için getirir."""
    return crud.get_all_teams(db=db)

@router.get("/{team_id}", response_model=TeamRead, summary="Belirli bir takımın detaylarını getir.")
def read_team(team_id: int, db: Session = Depends(get_db)):
    """ID'ye göre tek bir takımın tüm detaylarını ve üyelerini getirir."""
    db_team = crud.get_team_by_id(db, team_id=team_id)
    if db_team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Takım bulunamadı.")
    return db_team


# --- Admin Rotaları (POST, PUT, DELETE) ---

@router.post("", response_model=TeamRead, status_code=status.HTTP_201_CREATED, summary="Yeni bir takım oluştur (Admin).")
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    # admin_user: dict = Depends(verify_admin_token) 
):
    if crud.get_team_by_name(db, name=team.name):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"'{team.name}' adlı takım adı zaten mevcut. Lütfen farklı bir ad seçin."
        )
        
    generated_slug = crud.create_slug(team.name)
    if crud.get_team_by_slug(db, slug=generated_slug):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{team.name}' adından üretilen URL ('{generated_slug}') zaten kullanımda. Lütfen takım adını değiştirin."
        )
        
    return crud.create_team_with_members(db=db, team=team)

# YENİ EKLENEN KISIM: PUT
@router.put("/{team_id}", response_model=TeamRead, summary="Bir takımı güncelle (Admin).")
def update_team(
    team_id: int, 
    team_update: TeamUpdate, 
    db: Session = Depends(get_db),
    # admin_user: dict = Depends(verify_admin_token)
):
    """
    Belirtilen ID'ye sahip takımın bilgilerini günceller. Sadece gönderilen alanlar değiştirilir.
    """
    db_team = crud.get_team_by_id(db, team_id=team_id)
    if not db_team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Güncellenecek takım bulunamadı.")
    
    # Eğer isim güncelleniyorsa ve yeni isim zaten başkası tarafından kullanılıyorsa hata ver
    if team_update.name and team_update.name != db_team.name:
        if crud.get_team_by_name(db, name=team_update.name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{team_update.name}' adlı takım adı zaten mevcut."
            )

    return crud.update_team(db=db, db_team=db_team, team_update=team_update)

# YENİ EKLENEN KISIM: DELETE
@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Bir takımı sil (Admin).")
def delete_team(
    team_id: int, 
    db: Session = Depends(get_db),
    # admin_user: dict = Depends(verify_admin_token)
):
    """
    Belirtilen ID'ye sahip takımı ve ilişkili tüm üyelerini siler.
    """
    db_team = crud.get_team_by_id(db, team_id=team_id)
    if not db_team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Silinecek takım bulunamadı.")
    
    crud.delete_team(db=db, team_id=team_id)
    return {"ok": True} # 204 yanıtı bir içerik döndürmez.