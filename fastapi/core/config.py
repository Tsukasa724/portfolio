from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "My Project"
    VERSION: str = "0.1.0"
    API_PREFIX: str = "/"

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_SERVER: str
    POSTGRES_PORT: str
    POSTGRES_DB: str

    model_config = ConfigDict(
        case_sensitive=True
    )

settings = Settings()