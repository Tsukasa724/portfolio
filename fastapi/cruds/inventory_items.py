from typing import List
from uuid import UUID
import core.errors as errors
from database.database import SessionLocal
from models.account import Account
from fastapi.models.inventory_items import InventoryItem
from sqlalchemy.orm import Session, joinedload

"""def get_multi(db: Session, skip: int = 0, limit: int = 10) -> List[User]:
    try:
        # 全件の件数取得
        total_count = db.query(User).join(Account).filter(Account.is_deleted != True).count()
        # accountのis_deletedがFalseのものだけ取得
        items = db.query(User).join(Account).filter(Account.is_deleted != True).offset(skip).limit(limit).all()
    except Exception as e:
        print(e)
        raise errors.InternalServerError('ユーザー一覧取得に失敗しました。', e)

    if len(items) == 0:
        raise errors.NotFoundError('ユーザーが見つかりませんでした。')

    response = {
        'offset': skip,
        'count': len(items),
        'totalCount': total_count,
        'data': items
    }

    return response


def get_user_by_id(db: Session, user_id: int):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        return user

    except Exception as e:
        print(e)
        raise errors.InternalServerError('ユーザー情報取得に失敗しました。', e)
"""