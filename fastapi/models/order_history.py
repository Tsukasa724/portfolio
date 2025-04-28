from datetime import datetime
from database.database import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, SmallInteger, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class OrderHistory(Base):
    __tablename__ = 'order_history'

    id = Column(SmallInteger, primary_key=True, index=True, autoincrement=True)
    item_id = Column(SmallInteger, ForeignKey('inventory_items.id'), nullable=False)
    history_status = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

inventory_items = relationship("InventoryItems", back_populates="order_history")
order_status = relationship("OrderStatus", back_populates="order_history", uselist=False)