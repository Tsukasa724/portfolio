from datetime import datetime
from uuid import uuid4

from database.database import Base
from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.orm import relationship


class Account(Base):
    __tablename__ = 't_account'

    id = Column(String, primary_key=True, index=True, default=uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    user = relationship("User", back_populates="account", uselist=False)