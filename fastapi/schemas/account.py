from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class AccountBase(BaseModel):
    id: UUID = Field(..., alias='id', description='アカウントID', example='00000000-0000-0000-0000-000000000000')
    email: Optional[str] = Field(..., alias='email', description='メールアドレス', example='user@example.com')
    role: str = Field(..., alias='role', description='ユーザーロール', example='admin')


class CreateAccount(BaseModel):
    email: Optional[str] = Field(..., alias='email', description='メールアドレス', example='user@example.com')
    password_hash: str = Field(..., alias='password_hash', description='パスワード', example='strongpassword123')
    role: str = Field(..., alias='role', description='ユーザーロール', example='user')


class AccessToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
