import core.errors as errors
from typing import List
from uuid import UUID
from database.database import SessionLocal
from models.inventory_items import InventoryItem
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException

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

def get_item_list(db: Session, skip: int = 0, limit: int = 10) -> List[InventoryItem]:
    total_count = db.query(InventoryItem).count()
    all_data = db.query(InventoryItem).offset(skip).limit(limit).all()

    if total_count == 0:
        raise HTTPException(status_code=404, detail=f"在庫管理物が見つかりませんでした")

    response = {
        'offset': skip,
        'count': len(all_data),
        'totalCount': total_count,
        'data': all_data
    }


    return response