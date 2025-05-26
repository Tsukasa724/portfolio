from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from schemas.inventory_items import RelationItemBase
from schemas.list import ListBase
from datetime import datetime, timedelta, timezone

# 日本時間（UTC+9）
JST = timezone(timedelta(hours=9))

class OrderHistoryBase(BaseModel):
    id: Optional[int] = Field(None, alias='id', description='履歴ID', example=1001)
    item_id: int = Field(..., alias='item_id', description='商品ID', example=1001)
    history_status: str = Field(..., alias='history_status', description='発注履歴', example='発注完了')
    created_at: datetime
    inventory_item: RelationItemBase

    class Config:
        json_encoders = {
            datetime: lambda v: v.astimezone(JST).strftime('%Y/%m/%d')
        }


class OrderHistoryList(ListBase):
    data: list[OrderHistoryBase] = Field(None, alias='data', description='注文履歴リスト')