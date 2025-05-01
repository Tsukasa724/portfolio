import core.errors as errors
import schemas.account as schemas_account
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/dashboard",
    tags=["ダッシュボード"]
)

# OAuth 2.0 認証を実装
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")


@router.get(
    "/",
    summary="ログイン認証",
    response_description="emailとパスワードを使用したログイン認証",
    response_model = schemas_account.CreateAccount,
    response_model_exclude_none=True,
    responses=errors.error_response([errors.NotFound, errors.InvalidParameter, errors.InternalServerError])
)

async def read_items(token: str = Depends(oauth2_scheme)):
    return {"token": token}