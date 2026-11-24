FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt requirements.lock.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY *.py ./
RUN useradd -m -u 10001 ocr
USER ocr
ENV PADDLE_PDX_MODEL_SOURCE=BOS PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK=True
CMD ["python", "worker.py"]
