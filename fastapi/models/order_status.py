from datetime import datetime
from database.database import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, SmallInteger, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class OrderStatus(Base):
    __tablename__ = 'order_status'

    id = Column(SmallInteger, primary_key=True, index=True, autoincrement=True)
    history_id = Column(SmallInteger, ForeignKey('order_history.id'), nullable=False)
    current_status = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    order_history = relationship("OrderHistory", back_populates="order_statuses")