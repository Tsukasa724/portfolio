from datetime import datetime
from uuid import uuid4

from database.database import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 't_user'

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(String, ForeignKey("t_account.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    memo = Column(String, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    account = relationship("Account", back_populates="user")
