from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field
from schemas.account import AccountBase
from schemas.list import ListBase


class UserBase(BaseModel):
    id: int = Field(None, alias='id', description='ユーザID', example=1001)
    name: str = Field(None, alias='name', description='ユーザ名', example='user')


class User(UserBase):
    memo: Optional[str] = Field(None, alias='memo', description='メモ', example='メモ')
    account: AccountBase = Field(None, alias='account', description='アカウント情報')

    model_config = ConfigDict(
        from_attribute = True
    )


class UserList(ListBase):
    data: list[User] = Field(None, alias='data', description='ユーザリスト')


class UserCreate(UserBase):
    name: str = Field(..., alias='name', description='ユーザ名', example='user')
    memo: Optional[str] = Field(None, alias='memo', description='メモ', example='メモ')
