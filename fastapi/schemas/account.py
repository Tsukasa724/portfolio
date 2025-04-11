from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AccountBase(BaseModel):
    id: UUID = Field(None, alias='id', description='アカウントID', example='00000000-0000-0000-0000-000000000000')
    email: str = Field(None, alias='email', description='メールアドレス', example='sample@gmail.com')


class CreateAccount(BaseModel):
    email: str = Field(None, alias='email', description='メールアドレス', example='sample@gmail.com')