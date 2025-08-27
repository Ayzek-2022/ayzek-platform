from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.team import TeamMemberOut, TeamMemberCreate, TeamMemberUpdate
from app.crud.team import (
    get_team_members,
    get_team_member as get_member,
    create_team_member as create_member,
    update_team_member as update_member,
    delete_team_member as delete_member,
)

router = APIRouter(prefix="/team", tags=["Team"])

@router.get("/", response_model=List[TeamMemberOut])
def list_team_members(db: Session = Depends(get_db)):
    return get_team_members(db)

@router.get("/{member_id}", response_model=TeamMemberOut)
def retrieve_team_member(member_id: int, db: Session = Depends(get_db)):
    member = get_member(db, member_id)
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Üye bulunamadı")
    return member

@router.post("/", response_model=TeamMemberOut, status_code=status.HTTP_201_CREATED)
def create_team_member(member_in: TeamMemberCreate, db: Session = Depends(get_db)):
    return create_member(db, member_in)

@router.put("/{member_id}", response_model=TeamMemberOut)
def update_team_member(member_id: int, member_in: TeamMemberUpdate, db: Session = Depends(get_db)):
    member = update_member(db, member_id, member_in)
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Üye bulunamadı")
    return member

@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_team_member(member_id: int, db: Session = Depends(get_db)):
    ok = delete_member(db, member_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Üye bulunamadı")
    return None
