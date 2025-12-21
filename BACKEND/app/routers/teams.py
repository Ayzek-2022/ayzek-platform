import os
import shutil
import uuid
import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import teams as crud
from app.schemas.teams import TeamRead, TeamCreate, TeamUpdate

# !!! GÜVENLİK İÇİN GEREKLİ IMPORT !!!
from app.security import get_current_admin

router = APIRouter(prefix="/teams", tags=["teams"])

# Resimlerin kaydedileceği klasör
UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# --- Public Rotalar (GET - HERKESE AÇIK) ---

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


# --- Admin Rotaları (POST, PUT, DELETE - KİLİTLİ) ---

@router.post("", response_model=TeamRead, status_code=status.HTTP_201_CREATED, summary="Yeni bir takım oluştur (Admin).")
def create_team(
    name: str = Form(...),
    project_name: str = Form(...),
    description: str = Form(...),
    category: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    # Members listesini JSON string olarak alacağız (Frontend JSON.stringify yapacak)
    members: Optional[str] = Form(None), 
    photo_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    # !!! KİLİT BURADA !!!
    current_admin: dict = Depends(get_current_admin)
):
    # 1. İsim kontrolü
    if crud.get_team_by_name(db, name=name):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"'{name}' adlı takım adı zaten mevcut. Lütfen farklı bir ad seçin."
        )
        
    # 2. Slug kontrolü
    generated_slug = crud.create_slug(name)
    if crud.get_team_by_slug(db, slug=generated_slug):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{name}' adından üretilen URL ('{generated_slug}') zaten kullanımda. Lütfen takım adını değiştirin."
        )

    final_photo_url = photo_url

    # 3. Dosya varsa kaydet
    if file:
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        final_photo_url = f"/public/uploads/{unique_filename}"

    # 4. JSON string olarak gelen üyeleri listeye çevir
    members_data = []
    if members:
        try:
            members_data = json.loads(members)
        except json.JSONDecodeError:
            members_data = []

    # 5. Şemayı oluştur
    team_in = TeamCreate(
        name=name,
        project_name=project_name,
        description=description,
        category=category,
        is_featured=is_featured,
        photo_url=final_photo_url,
        members=members_data # Pydantic modeli bunu doğrulayacaktır
    )
        
    return crud.create_team_with_members(db=db, team=team_in)


@router.put("/{team_id}", response_model=TeamRead, summary="Bir takımı güncelle (Admin).")
def update_team(
    team_id: int, 
    name: Optional[str] = Form(None),
    project_name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    is_featured: Optional[bool] = Form(None),
    members: Optional[str] = Form(None),
    photo_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    # !!! KİLİT BURADA !!!
    current_admin: dict = Depends(get_current_admin)
):
    """
    Belirtilen ID'ye sahip takımın bilgilerini günceller.
    """
    db_team = crud.get_team_by_id(db, team_id=team_id)
    if not db_team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Güncellenecek takım bulunamadı.")
    
    # İsim güncelleniyorsa benzersizlik kontrolü
    if name and name != db_team.name:
        if crud.get_team_by_name(db, name=name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{name}' adlı takım adı zaten mevcut."
            )

    final_photo_url = photo_url

    # Yeni dosya varsa kaydet
    if file:
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        final_photo_url = f"/public/uploads/{unique_filename}"

    # Members parsing
    members_data = None
    if members is not None:
        try:
            members_data = json.loads(members)
        except:
            pass 

    # Güncelleme verilerini hazırla (Sadece dolu olanları gönderiyoruz)
    update_data = {}
    if name is not None: update_data["name"] = name
    if project_name is not None: update_data["project_name"] = project_name
    if description is not None: update_data["description"] = description
    if category is not None: update_data["category"] = category
    if is_featured is not None: update_data["is_featured"] = is_featured
    if final_photo_url is not None: update_data["photo_url"] = final_photo_url
    if members_data is not None: update_data["members"] = members_data

    # Pydantic modelini oluştur
    team_update_model = TeamUpdate(**update_data)

    return crud.update_team(db=db, db_team=db_team, team_update=team_update_model)


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Bir takımı sil (Admin).")
def delete_team(
    team_id: int, 
    db: Session = Depends(get_db),
    # !!! KİLİT BURADA !!!
    current_admin: dict = Depends(get_current_admin)
):
    """
    Belirtilen ID'ye sahip takımı ve ilişkili tüm üyelerini siler.
    """
    db_team = crud.get_team_by_id(db, team_id=team_id)
    if not db_team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Silinecek takım bulunamadı.")
    
    crud.delete_team(db=db, team_id=team_id)
    return {"ok": True}