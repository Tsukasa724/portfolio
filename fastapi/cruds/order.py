import core.errors as errors
from typing import List
from uuid import UUID
from database.database import SessionLocal
from models.out_of_stock_items import OutOfStockItem
from models.order_history import OrderHistory
from models.order_status import OrderStatus
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException

def get_stock_items_list(db: Session, skip: int = 0, limit: int = 10) -> List[OutOfStockItem]:
    total_count = db.query(OutOfStockItem).count()
    all_data = db.query(OutOfStockItem).offset(skip).limit(limit).all()

    if total_count == 0:
        raise HTTPException(status_code=404, detail=f"在庫不足の管理物はありませんでした")

    response = {
        'offset': skip,
        'count': len(all_data),
        'totalCount': total_count,
        'data': all_data
    }

    return response

def edit_stock_items(db: Session, id: int, status: str):
    try:
        stock_item = db.query(OutOfStockItem).filter(OutOfStockItem.id == id).first()

        if not stock_item:
            raise errors.NotFound(f"ID {id} の在庫不足物が見つかりません。")

        stock_item.order_status = status
        db.commit()

    except errors.NotFound as e:
        raise e

    except Exception as e:
        print(e)
        raise errors.InternalServerError('在庫不足物の編集に失敗しました。', e)


def get_order_history_list(db: Session, skip: int = 0, limit: int = 10) -> List[OrderHistory]:
    total_count = db.query(OrderHistory).count()
    all_data = db.query(OrderHistory).offset(skip).limit(limit).all()

    if total_count == 0:
        raise HTTPException(status_code=404, detail=f"注文履歴はありませんでした")

    response = {
        'offset': skip,
        'count': len(all_data),
        'totalCount': total_count,
        'data': all_data
    }

    return response

def get_order_status_list(db: Session, skip: int = 0, limit: int = 10) -> List[OrderStatus]:
    total_count = db.query(OrderStatus).count()
    all_data = db.query(OrderStatus).offset(skip).limit(limit).all()

    if total_count == 0:
        raise HTTPException(status_code=404, detail=f"注文ステータスはありませんでした")

    response = {
        'offset': skip,
        'count': len(all_data),
        'totalCount': total_count,
        'data': all_data
    }

    return response