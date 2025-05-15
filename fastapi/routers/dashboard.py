import core.errors as errors
import schemas.inventory_items as schemas_inventory_itemBase
import schemas.out_of_stock_items as schemas_out_of_stock_itemsBase
import schemas.order_history as schemas_order_history_Base
import schemas.order_status as schemas_order_statusBase
import cruds.inventory_items as crud_inventory_items
import cruds.order as crud_order
from fastapi import APIRouter, Depends, Query
from database.database import get_db
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from typing import List

router = APIRouter(
    prefix="/dashboard",
    tags=["ダッシュボード"]
)

# OAuth 2.0 認証を実装
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

class ListQueryBase(BaseModel):
    offset: int = Field(Query(0, description='開始位置'))
    limit: int = Field(Query(500, ge=0, le=1000, description='取得件数'))

@router.post(
    "/create_items",
    summary="在庫管理物登録",
    response_description="在庫で管理している購入品等の新規登録",
    response_model = schemas_inventory_itemBase.InventoryItemBase,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def create_items(
    item_name: str,
    item_stock: int,
    order_threshold: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
    ):

    new_item = crud_inventory_items.create_items(db, item_name, item_stock, order_threshold)

    return new_item


@router.get(
    "/read_item_list",
    summary="在庫一覧",
    response_description="在庫管理物をDBから取得",
    response_model = schemas_inventory_itemBase.InventoryItemList,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def get_item_list(
    token: str = Depends(oauth2_scheme),
    query: ListQueryBase = Depends(),
    db: Session = Depends(get_db)
    ):

    new_item = crud_inventory_items.get_item_list(db, skip=query.offset, limit=query.limit)

    return new_item


@router.put(
    "/use_items",
    summary="複数在庫品の使用",
    response_description="複数の在庫管理物の在庫数を減少させる",
    response_model=List[schemas_inventory_itemBase.UsedItemResult],
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def use_items(
    items: List[schemas_inventory_itemBase.UseItemRequest],
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    return crud_inventory_items.use_items(db, items)


@router.put(
    "/add_items",
    summary="複数在庫品の追加",
    response_description="複数の在庫管理物の在庫数を増加させる",
    response_model=List[schemas_inventory_itemBase.AddItemResult],
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def use_items(
    items: List[schemas_inventory_itemBase.AddItemRequest],
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    return crud_inventory_items.add_items(db, items)


@router.get(
    "/read_out_stock_items_list",
    summary="在庫不足物の一覧",
    response_description="在庫不足となっている在庫管理物を一覧取得",
    response_model = schemas_out_of_stock_itemsBase.StockItemsList,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def get_stock_items_list(
    token: str = Depends(oauth2_scheme),
    query: ListQueryBase = Depends(),
    db: Session = Depends(get_db)
    ):

    stock_item = crud_order.get_stock_items_list(db, skip=query.offset, limit=query.limit)

    return stock_item


@router.put(
    "/edit_out_stock_items",
    summary="在庫不足物の注文ステータス編集",
    response_description="在庫不足物の注文ステータスを編集し、処理完了メッセージを返す",
    response_model=dict,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def edit_out_stock_items(
    id: int,
    status: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
    ):

    try:
        stock_item = crud_order.edit_stock_items(db, id, status)
        return {"message": "処理完了"}

    except errors.NotFound as e:
        raise e

    except Exception as e:
        print(e)
        raise errors.InternalServerError('在庫不足物の編集に失敗しました。', e)


@router.get(
    "/read_order_history_list",
    summary="発注履歴の一覧",
    response_description="発注履歴の一覧取得",
    response_model = schemas_order_history_Base.OrderHistoryList,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def get_stock_items_list(
    token: str = Depends(oauth2_scheme),
    query: ListQueryBase = Depends(),
    db: Session = Depends(get_db)
    ):

    history_list = crud_order.get_order_history_list(db, skip=query.offset, limit=query.limit)

    return history_list


@router.get(
    "/read_order_status_list",
    summary="発注ステータスの一覧",
    response_description="発注ステータスの一覧取得",
    response_model = schemas_order_statusBase.OrderStatusList,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def get_stock_items_list(
    token: str = Depends(oauth2_scheme),
    query: ListQueryBase = Depends(),
    db: Session = Depends(get_db)
    ):

    status_list = crud_order.get_order_status_list(db, skip=query.offset, limit=query.limit)

    return status_list