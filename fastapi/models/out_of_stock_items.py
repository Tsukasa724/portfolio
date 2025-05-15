from datetime import datetime
from database.database import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, SmallInteger, String, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class OutOfStockItem(Base):
    __tablename__ = 'out_of_stock_items'

    id = Column(SmallInteger, ForeignKey('inventory_items.id', ondelete='CASCADE'), primary_key=True)
    item_name = Column(Text, nullable=False)
    item_stock = Column(Integer, nullable=False)
    order_threshold = Column(Integer, nullable=False)
    out_of_stock_timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    order_status = Column(String, default='発注待ち', nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    inventory_item = relationship("InventoryItem", back_populates="out_of_stock_item")
