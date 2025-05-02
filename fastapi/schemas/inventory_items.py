from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from schemas.list import ListBase


class InventoryItemBase(BaseModel):
    id: Optional[int] = Field(None, alias='id', description='商品ID', example=1001)
    item_name: str = Field(..., alias='item_name', description='商品名', example='サンプル商品')
    item_stock: int = Field(..., alias='item_stock', description='在庫数', example=50)
    order_threshold: int = Field(..., alias='order_threshold', description='発注点', example=10)
    stock_status: str = Field(..., alias='stock_status', description='在庫ステータス', example='在庫あり')

class InventoryItem(BaseModel):
    item_name: str = Field(..., alias='item_name', description='商品名', example='サンプル商品')
    item_stock: int = Field(..., alias='item_stock', description='在庫数', example=50)
    order_threshold: int = Field(..., alias='order_threshold', description='発注点', example=10)
    stock_status: str = Field(..., alias='stock_status', description='在庫ステータス', example='在庫あり')

class InventoryItemList(ListBase):
    data: list[InventoryItem] = Field(None, alias='data', description='在庫管理物リスト')