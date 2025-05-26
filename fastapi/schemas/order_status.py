from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from schemas.order_history import OrderHistoryBase
from schemas.list import ListBase
from datetime import datetime, timedelta, timezone

# 日本時間（UTC+9）
JST = timezone(timedelta(hours=9))

class OrderStatusBase(BaseModel):
    id: Optional[int] = Field(None, alias='id', description='注文ステータスID', example=1001)
    history_id: int = Field(..., alias='history_id', description='履歴ID', example=1001)
    current_status: str = Field(..., alias='current_status', description='現在のステータス', example='発注済み')
    created_at: datetime
    order_history: OrderHistoryBase

    class Config:
        json_encoders = {
            datetime: lambda v: v.astimezone(JST).strftime('%Y/%m/%d')
        }

class OrderStatusList(ListBase):
    data: list[OrderStatusBase] = Field(None, alias='data', description='注文ステータスリスト')