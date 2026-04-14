from pydantic import BaseModel

class AccountBase(BaseModel):
    name: str
    policy_type: str
    premium: float

class AccountCreate(AccountBase):
    pass

class AccountResponse(AccountBase):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    password: str

class UserLogin(BaseModel):
    name: str
    password: str