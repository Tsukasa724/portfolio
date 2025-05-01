import core.errors as errors
import schemas.inventory_items as schemas_inventory_itemBase
import cruds.inventory_items as crud_inventory_items
from fastapi import APIRouter, Depends
from database.database import get_db
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/dashboard",
    tags=["ダッシュボード"]
)

# OAuth 2.0 認証を実装
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")


@router.post(
    "/",
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