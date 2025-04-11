from fastapi import APIRouter

router = APIRouter(
    prefix="/sample",
    tags=["サンプル"]
)

@router.get(
    "/",
    response_description="サンプルデータを取得します。",
    response_model_exclude_none=True,
)
async def get_sample_data():
    print('Hello, World!')
    return {"message": "Hello, World!"}
