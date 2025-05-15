from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from schemas.list import ListBase


class OrderStatusBase(BaseModel):
    id: Optional[int] = Field(None, alias='id', description='注文ステータスID', example=1001)
    history_id: int = Field(..., alias='history_id', description='履歴ID', example=1001)
    current_status: str = Field(..., alias='current_status', description='現在のステータス', example='発注済み')

class OrderStatusList(ListBase):
    data: list[OrderStatusBase] = Field(None, alias='data', description='注文ステータスリスト')