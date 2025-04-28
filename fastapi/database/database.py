import logging
from core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ログ設定
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# DB接続
DATABASE_URL = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        if db:
            db.rollback()
        raise e
    finally:
        if db:
            db.close()

Base = declarative_base()