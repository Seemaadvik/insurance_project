from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    policy_type = Column(String)
    premium = Column(Float)