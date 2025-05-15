from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from schemas.list import ListBase


class OrderHistoryBase(BaseModel):
    id: Optional[int] = Field(None, alias='id', description='履歴ID', example=1001)
    item_id: int = Field(..., alias='item_id', description='商品ID', example=1001)
    history_status: str = Field(..., alias='history_status', description='発注履歴', example='発注完了')

class OrderHistoryList(ListBase):
    data: list[OrderHistoryBase] = Field(None, alias='data', description='注文履歴リスト')