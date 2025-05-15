from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from schemas.list import ListBase


class StockItemsBase(BaseModel):
    id: int = Field(..., alias='id', description='在庫物ID', example=1001)
    item_name: str = Field(..., alias='item_name', description='在庫物名', example='サンプル')
    item_stock: int = Field(..., alias='item_stock', description='現在数', example=10)
    order_threshold: int = Field(..., alias='order_threshold', description='注文閾値', example=50)
    order_status: str = Field(..., alias='order_status', description='注文中を表示', example='注文中')

class StockItemsList(ListBase):
    data: list[StockItemsBase] = Field(None, alias='data', description='在庫管理物リスト')

class OutStockItemsBase(BaseModel):
    id: int = Field(..., alias='id', description='在庫物ID', example=1001)
    order_status: str = Field(..., alias='order_status', description='注文中を表示', example='注文中')