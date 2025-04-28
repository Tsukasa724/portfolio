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


@router.post(
    "/",
    summary="アカウント情報登録",
    response_description="新規アカウント情報登録する",
    response_model = schemas_account.CreateAccount,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)
async def create_account(
        email: str,
        password_hash: str,
        role: str,
        db: Session = Depends(get_db)
    ):
    account = crud_account.create_account(db, email, password_hash, role)

    return account