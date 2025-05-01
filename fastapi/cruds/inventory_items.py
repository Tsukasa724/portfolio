from typing import List
from uuid import UUID
import core.errors as errors
from database.database import SessionLocal
from models.inventory_items import InventoryItem
from sqlalchemy.orm import Session, joinedload

def create_items(db: Session, item_name: str, item_stock: int, order_threshold: int):

    new_item = InventoryItem(
            item_name=item_name,
            item_stock=item_stock,
            order_threshold=order_threshold
        )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item