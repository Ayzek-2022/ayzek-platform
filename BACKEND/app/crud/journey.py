# crud/journey.py

from sqlalchemy.orm import Session
from typing import List, Dict
from collections import defaultdict
from ..schemas.journey import JourneyPersonUpdate
from ..models import JourneyPerson
from ..schemas.journey import JourneyPersonCreate

# YENİ BİR KİŞİ OLUŞTURMA
def create_journey_person(db: Session, person: JourneyPersonCreate) -> JourneyPerson:
    db_person = JourneyPerson(**person.model_dump())
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person

# TÜM KİŞİLERİ YILLARA GÖRE GRUPLANMIŞ OLARAK GETİRME
def get_all_journey_people_grouped_by_year(db: Session) -> Dict[int, List[JourneyPerson]]:
    """
    Frontend'in kolay kullanması için tüm kayıtları yıllara göre gruplar.
    Yeni eklenenler ilgili yılın EN SONUNDA görünür (created_at ASC).
    """
    people = (
        db.query(JourneyPerson)
        .order_by(
            JourneyPerson.year.desc(),
            JourneyPerson.created_at.asc(),
            JourneyPerson.id.asc(),
        )
        .all()
    )

    grouped_people: Dict[int, List[JourneyPerson]] = defaultdict(list)
    for person in people:
        grouped_people[person.year].append(person)

    return dict(grouped_people)

# BELİRLİ BİR KİŞİYİ ID'YE GÖRE SİLME
def delete_journey_person(db: Session, person_id: int) -> bool:
    db_person = db.query(JourneyPerson).filter(JourneyPerson.id == person_id).first()
    if db_person:
        db.delete(db_person)
        db.commit()
        return True
    return False

# ID'ye göre tek bir kişi getirme (silme işlemi için yardımcı)
def get_journey_person_by_id(db: Session, person_id: int) -> JourneyPerson | None:
    return db.query(JourneyPerson).filter(JourneyPerson.id == person_id).first()

def update_journey_person(db: Session, person_id: int, person_update: JourneyPersonUpdate) -> JourneyPerson | None:
    db_person = get_journey_person_by_id(db, person_id=person_id)
    if not db_person:
        return None

    update_data = person_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_person, key, value)

    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person
