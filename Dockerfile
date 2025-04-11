# Image de base avec Python
FROM python:3.10

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    tesseract-ocr \
    tesseract-ocr-fra \
    gcc \
    g++ \
    build-essential \
    cmake \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances et installation
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY registration.py ./
COPY pics/ ./pics/

# Exposer le port de l'API
EXPOSE 8000

# Commande pour démarrer l'application
CMD ["uvicorn", "registration:app", "--host", "0.0.0.0", "--port", "8000"]