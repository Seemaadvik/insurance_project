from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from . import models, schemas, crud
from .database import engine, SessionLocal, Base
from fastapi.middleware.cors import CORSMiddleware
# -------------------------
# CREATE APP
# -------------------------
app = FastAPI(title="Insurance Account API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# CREATE DATABASE TABLES
# -------------------------
Base.metadata.create_all(bind=engine)

# -------------------------
# STATIC FILES (UI)
# -------------------------
app.mount("/static", StaticFiles(directory="static"), name="static")


# -------------------------
# DB SESSION
# -------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# HOME API
# -------------------------
@app.get("/")
def home():
    return {"message": "Insurance API Running"}


# -------------------------
# UI PAGE
# -------------------------
@app.get("/ui")
def ui():
    return FileResponse(os.path.join("static", "index.html"))


# -------------------------
# CREATE ACCOUNT
# -------------------------
@app.post("/accounts/")
def create_account(acc: schemas.AccountCreate, db: Session = Depends(get_db)):
    return crud.create_account(db, acc)


# -------------------------
# GET ALL ACCOUNTS
# -------------------------
@app.get("/accounts/")
def get_accounts(db: Session = Depends(get_db)):
    return crud.get_accounts(db)


# -------------------------
# GET SINGLE ACCOUNT
# -------------------------
@app.get("/accounts/{acc_id}")
def get_account(acc_id: int, db: Session = Depends(get_db)):
    acc = crud.get_account(db, acc_id)
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found")
    return acc


# -------------------------
# UPDATE ACCOUNT
# -------------------------
@app.put("/accounts/{acc_id}")
def update_account(acc_id: int, acc: schemas.AccountCreate, db: Session = Depends(get_db)):
    updated = crud.update_account(db, acc_id, acc)
    if not updated:
        raise HTTPException(status_code=404, detail="Account not found")
    return updated


# -------------------------
# DELETE ACCOUNT
# -------------------------
@app.delete("/accounts/{acc_id}")
def delete_account(acc_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_account(db, acc_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Account deleted successfully"}


# -------------------------
# COUNT ACCOUNTS
# -------------------------
@app.get("/accounts-count/")
def count_accounts(db: Session = Depends(get_db)):
    return {"total_accounts": crud.count_accounts(db)}