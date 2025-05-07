import core.errors as errors
from typing import List
from uuid import UUID
from database.database import SessionLocal
from models.inventory_items import InventoryItem
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from schemas.inventory_items import UseItemRequest, UsedItemResult, AddItemRequest, AddItemResult

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

def use_items(db: Session, items: List[UseItemRequest]) -> List[UsedItemResult]:
    results = []

    for item in items:
        try:
            db_item = db.query(InventoryItem).filter(InventoryItem.item_name == item.item_name).first()

            if db_item is None:
                results.append(UsedItemResult(
                    item_name=item.item_name,
                    item_stock=None,
                    success=False,
                    message="Item not found"
                ))
                continue

            if db_item.item_stock < item.item_stock:
                results.append(UsedItemResult(
                    item_name=item.item_name,
                    item_stock=db_item.item_stock,
                    success=False,
                    message="Not enough stock"
                ))
                continue

            db_item.item_stock -= item.item_stock
            db.add(db_item)
            db.flush()

            results.append(UsedItemResult(
                item_name=db_item.item_name,
                item_stock=db_item.item_stock,
                success=True
            ))

        except Exception as e:
            db.rollback()
            results.append(UsedItemResult(
                item_name=item.item_name,
                item_stock=None,
                success=False,
                message=f"Unexpected error: {str(e)}"
            ))

    db.commit()
    return results

def add_items(db: Session, items: List[AddItemRequest]) -> List[AddItemResult]:
    results = []

    for item in items:
        try:
            db_item = db.query(InventoryItem).filter(InventoryItem.item_name == item.item_name).first()

            if db_item is None:
                results.append(AddItemResult(
                    item_name=item.item_name,
                    item_stock=None,
                    success=False,
                    message="Item not found"
                ))
                continue

            db_item.item_stock += item.item_stock
            db.add(db_item)
            db.flush()

            results.append(AddItemResult(
                item_name=db_item.item_name,
                item_stock=db_item.item_stock,
                success=True
            ))

        except Exception as e:
            db.rollback()
            results.append(AddItemResult(
                item_name=item.item_name,
                item_stock=None,
                success=False,
                message=f"Unexpected error: {str(e)}"
            ))

    db.commit()
    return results