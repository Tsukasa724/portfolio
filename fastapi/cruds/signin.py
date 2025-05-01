import os
import core.errors as errors
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from typing import Union
from jose import jwt
from sqlalchemy.orm import Session
from models.account import Account
from sqlalchemy.orm import Session
from passlib.context import CryptContext

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# パスワードチェック
def verify_password(password, password_hash):
    return pwd_context.verify(password, password_hash)

# トークンを作成する関数
def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ログインに成功した場合はアカウント情報を取得する
def signin(db: Session, email: str, password: str):

    # db内のアカウントと入力したアカウント情報を比較しログイン機能を実装
    account = db.query(Account).filter(Account.email == email).first()

    # accountからハッシュされたパスワードとパラメーターのパスワードを比較してbool値を返すだけ
    if not verify_password(password, account.password_hash):
        raise errors.AccessDenied

    # 問題なかったらアクセストークンを生成して返却
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email}, expires_delta=access_token_expires
    )

    return access_token