FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

WORKDIR /fastapi

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r /fastapi/requirements.txt
RUN pip install debugpy

COPY ./fastapi/ .
CMD ["python3", "-m", "debugpy", "--listen", "0.0.0.0:5678", "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]