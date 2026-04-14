from sqlalchemy.orm import Session
from . import models, schemas

# CREATE
def create_account(db: Session, acc: schemas.AccountCreate):
    db_acc = models.Account(**acc.model_dump())
    db.add(db_acc)
    db.commit()
    db.refresh(db_acc)
    return db_acc

# READ ALL
def get_accounts(db: Session):
    return db.query(models.Account).all()

# READ ONE
def get_account(db: Session, acc_id: int):
    return db.query(models.Account).filter(models.Account.id == acc_id).first()

# UPDATE
def update_account(db: Session, acc_id: int, acc: schemas.AccountCreate):
    db_acc = get_account(db, acc_id)
    if db_acc:
        db_acc.name = acc.name
        db_acc.policy_type = acc.policy_type
        db_acc.premium = acc.premium
        db.commit()
        db.refresh(db_acc)
    return db_acc

# DELETE
def delete_account(db: Session, acc_id: int):
    db_acc = get_account(db, acc_id)
    if db_acc:
        db.delete(db_acc)
        db.commit()
    return db_acc

# COUNT
def count_accounts(db: Session):
    return db.query(models.Account).count()