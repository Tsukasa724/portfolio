import core.errors as errors
import cruds.account as crud_account
from database.database import get_db
from fastapi import APIRouter, Depends, Query
from fastapi.security import HTTPBearer
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
"""
router = APIRouter(
    prefix="/user",
    tags=["ユーザー情報"]
)


class ListQueryBase(BaseModel):
    offset: int = Field(Query(0, description='開始位置'))
    limit: int = Field(Query(20, ge=0, le=1000, description='取得件数'))


@router.get(
    "",
    summary="ユーザー一覧取得",
    response_description="ユーザー一覧を取得する。",
    response_model = schemas_user.UserList,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)
async def get_user_list(
        account_id: str = Depends(crud_account.check_token),
        query: ListQueryBase = Depends(),
        db: Session = Depends(get_db),
    ):
    users = crud_user.get_multi(db, skip=query.offset, limit=query.limit)

    return users


@router.get(
    "/{user_id}",
    summary="ユーザー情報取得",
    response_description="ユーザー情報を取得する。",
    response_model = schemas_user.User,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InternalServerError])
)
async def get_user(
        user_id: int,
        db: Session = Depends(get_db)
    ):
    user = crud_user.get_user_by_id(db, user_id)

    return user
    """