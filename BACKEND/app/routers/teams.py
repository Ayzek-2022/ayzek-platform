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
from app.security import get_current_admin

router = APIRouter(prefix="/teams", tags=["teams"])

# Resimlerin kaydedileceği klasör
UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Public Rotalar ---

@router.get("/featured", response_model=List[TeamRead])
def read_featured_teams(db: Session = Depends(get_db)):
    return crud.get_featured_teams(db=db, limit=4)

@router.get("", response_model=List[TeamRead])
def read_all_teams(db: Session = Depends(get_db)):
    return crud.get_all_teams(db=db)

@router.get("/{team_id}", response_model=TeamRead)
def read_team(team_id: int, db: Session = Depends(get_db)):
    db_team = crud.get_team_by_id(db, team_id=team_id)
    if db_team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Takım bulunamadı.")
    return db_team

# --- Admin Rotaları (POST, PUT, DELETE) ---

@router.post("", response_model=TeamRead, status_code=status.HTTP_201_CREATED)
def create_team(
    name: str = Form(...),
    project_name: str = Form(...),
    description: str = Form(...),
    category: Optional[str] = Form(None),
    is_featured: str = Form("false"), # FormData her şeyi string gönderir
    members: Optional[str] = Form("[]"), 
    photo_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None), # Bilgisayardan seçilen dosya
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    # 1. Benzersizlik kontrolü
    if crud.get_team_by_name(db, name=name):
        raise HTTPException(status_code=400, detail=f"'{name}' adlı takım zaten mevcut.")

    # 2. Dosya Kaydetme (Bilgisayardan dosya seçilmişse)
    final_photo_url = photo_url
    if file:
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        final_photo_url = f"/public/uploads/{unique_filename}"

    # 3. JSON string olarak gelen üyeleri listeye çevir
    try:
        members_data = json.loads(members) if members else []
    except json.JSONDecodeError:
        members_data = []

    # 4. Pydantic şemasını doğrulama (422 hatasını burada manuel yakalayabiliriz)
    try:
        team_in = TeamCreate(
            name=name,
            project_name=project_name,
            description=description,
            category=category,
            is_featured=is_featured.lower() == "true",
            photo_url=final_photo_url,
            members=members_data
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Veri doğrulama hatası: {str(e)}")
        
    return crud.create_team_with_members(db=db, team=team_in)

@router.put("/{team_id}", response_model=TeamRead)
def update_team(
    team_id: int, 
    name: Optional[str] = Form(None),
    project_name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    is_featured: Optional[str] = Form(None),
    members: Optional[str] = Form(None),
    photo_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    db_team = crud.get_team_by_id(db, team_id=team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Güncellenecek takım bulunamadı.")
    
    final_photo_url = photo_url
    if file:
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        final_photo_url = f"/public/uploads/{unique_filename}"

    update_data = {}
    if name is not None: update_data["name"] = name
    if project_name is not None: update_data["project_name"] = project_name
    if description is not None: update_data["description"] = description
    if category is not None: update_data["category"] = category
    if is_featured is not None: update_data["is_featured"] = is_featured.lower() == "true"
    if final_photo_url is not None: update_data["photo_url"] = final_photo_url
    
    if members is not None:
        try:
            update_data["members"] = json.loads(members)
        except:
            pass

    team_update_model = TeamUpdate(**update_data)
    return crud.update_team(db=db, db_team=db_team, team_update=team_update_model)

@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: int, db: Session = Depends(get_db), current_admin: dict = Depends(get_current_admin)):
    if not crud.delete_team(db=db, team_id=team_id):
        raise HTTPException(status_code=404, detail="Silinecek takım bulunamadı.")
    return None