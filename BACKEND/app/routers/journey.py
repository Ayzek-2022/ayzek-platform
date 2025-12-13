# routers/journey.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from ..schemas.journey import JourneyPersonUpdate
from ..database import get_db
from ..crud import journey as crud
from ..schemas.journey import JourneyPersonCreate, JourneyPersonRead

router = APIRouter(
    prefix="/journey",
    tags=["Journey"]
)

# --- PUBLIC ROUTE (Frontend için) ---

@router.get("/", response_model=Dict[int, List[JourneyPersonRead]], summary="Tüm 'Yolculuğumuz' kayıtlarını yıllara göre gruplanmış olarak getirir.")
def read_all_journey_people(db: Session = Depends(get_db)):
    """
    Frontend'de zaman çizelgesini oluşturmak için tüm kişileri `{2023: [...], 2022: [...]}` formatında döndürür.
    """
    return crud.get_all_journey_people_grouped_by_year(db=db)


# --- ADMIN ROUTES (Yönetim paneli için) ---

@router.post("/", response_model=JourneyPersonRead, status_code=status.HTTP_201_CREATED, summary="Yeni bir 'Yolculuğumuz' kişisi oluşturur (Admin).")
def create_journey_person(person: JourneyPersonCreate, db: Session = Depends(get_db)):
    """
    Admin panelinden gelen verilerle yeni bir kişi kaydı oluşturur.
    - **year**: Kişinin görüneceği yıl.
    - **name**: İsim Soyisim.
    - **role**: Görevi.
    - **description**: Açıklaması / Sözü.
    - **photo_url**: Profil fotoğrafının URL'si (opsiyonel).
    """
    return crud.create_journey_person(db=db, person=person)

@router.put("/{person_id}", response_model=JourneyPersonRead, summary="Bir 'Yolculuğumuz' kişisini günceller (Admin).")
def update_journey_person(person_id: int, person_update: JourneyPersonUpdate, db: Session = Depends(get_db)):
    """
    ID'ye göre belirtilen kişi kaydının bilgilerini günceller.
    Sadece gönderilen alanlar güncellenir.
    """
    db_person = crud.get_journey_person_by_id(db, person_id=person_id)
    if db_person is None:
        raise HTTPException(status_code=404, detail="Kişi bulunamadı")
    
    updated_person = crud.update_journey_person(db=db, person_id=person_id, person_update=person_update)
    return updated_person



@router.delete("/{person_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Bir 'Yolculuğumuz' kişisini siler (Admin).")
def delete_journey_person(person_id: int, db: Session = Depends(get_db)):
    """
    ID'ye göre belirtilen kişi kaydını veritabanından siler.
    """
    db_person = crud.get_journey_person_by_id(db, person_id=person_id)
    if db_person is None:
        raise HTTPException(status_code=404, detail="Kişi bulunamadı")
    
    crud.delete_journey_person(db=db, person_id=person_id)
    return {"ok": True} # 204 No Content yanıtı boş döner, bu sadece Swagger için.