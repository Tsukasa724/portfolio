from datetime import datetime
from database.database import Base
from models.order_history import OrderHistory
from models.out_of_stock_items import OutOfStockItem
from sqlalchemy import Boolean, Column, DateTime, Integer, SmallInteger, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class InventoryItem(Base):
    __tablename__ = 'inventory_items'

    id = Column(SmallInteger, primary_key=True, index=True, autoincrement=True)
    item_name = Column(String, nullable=False)
    item_stock = Column(Integer, nullable=False)
    order_threshold = Column(Integer, nullable=False)
    stock_status = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    order_history = relationship("OrderHistory", back_populates="inventory_item", uselist=False)
    out_of_stock_item = relationship("OutOfStockItem", back_populates="inventory_item", uselist=False, cascade="all, delete")