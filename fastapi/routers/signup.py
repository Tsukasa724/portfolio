import core.errors as errors
import cruds.account as crud_account
import schemas.account as schemas_account
from database.database import get_db
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/signup",
    tags=["アカウント登録"]
)


class QueryParams(BaseModel):
    email: str = Field(Query(default=None, description='メールアドレス'))


@router.post(
    "/",
    summary="アカウント情報登録",
    response_description="アカウント情報登録する。",
    response_model = schemas_account.AccountBase,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)
async def create_account(
        account: schemas_account.CreateAccount,
        db: Session = Depends(get_db)
    ):
    account = crud_account.create_account(db, account.email)

    return account