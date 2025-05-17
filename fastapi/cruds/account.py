import core.errors as errors
from typing import List
from uuid import UUID
from database.database import SessionLocal
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from models.account import Account
from sqlalchemy.orm import Session
from passlib.context import CryptContext


def get_account_by_id(db: Session, account_id: str):

    try:
        account = db.query(Account).filter(Account.id == account_id).first()
        return account

    except Exception as e:
        print(e)
        raise errors.InternalServerError('アカウント情報取得に失敗しました。', e)

# パスワードをハッシュ化
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_account(db: Session, email: str, password_hash: str, role: str):

    hashed = pwd_context.hash(password_hash)
    _account = Account(
            email=email,
            password_hash=hashed,
            role=role
        )
    db.add(_account)
    db.commit()
    db.refresh(_account)

    return _account


# トークン解析
def check_token(headers: HTTPAuthorizationCredentials = Depends(HTTPBearer())):

    token = headers.credentials

    if token is None:
        raise HTTPException(status_code=401, detail='トークンが見つかりませんでした。')

    # TODO: トークンを複合化
    # TODO: トークンの有効期限をチェック
    # TODO: アカウントIDを取得
    account_id = None

    return account_id

