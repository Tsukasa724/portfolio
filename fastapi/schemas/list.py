from typing import Optional
from pydantic import BaseModel, Field


class ListBase(BaseModel):
    offset: int = Field(None, alias='offset', description='開始位置', example=1)
    count: int = Field(None, alias='count', description='取得件数', example=10)
    totalCount: int = Field(None, alias='totalCount', description='総件数', example=100)
