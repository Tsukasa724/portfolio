import core.errors as errors
import cruds.signin as crud_signin
import schemas.account as schemas_account
from database.database import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/signin",
    tags=["ログイン認証"]
)

# アクセストークンを発行するログイン処理
@router.post(
    "/",
    summary="ログイン認証",
    response_description="emailとパスワードを使用したログイン認証",
    response_model = schemas_account.AccessToken,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def login_by_email(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
    ):

    access_token = crud_signin.signin(db, form_data.username, form_data.password)

    return {"access_token": access_token, "token_type": "bearer"}