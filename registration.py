from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import face_recognition
import cv2
import easyocr
import numpy as np
import pytesseract
from PIL import Image
import io
import os

DEBUG = True

app = FastAPI()
reader = easyocr.Reader(['fr'], gpu=False)

def sauvegarder_visages(image_np, filename="debug_image.jpg"):
    """Dessine les rectangles autour des visages détectés et sauvegarde l’image."""
    face_locations = face_recognition.face_locations(image_np)
    image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    for (top, right, bottom, left) in face_locations:
        cv2.rectangle(image_bgr, (left, top), (right, bottom), (0, 255, 0), 2)

    cv2.imwrite(filename, image_bgr)
    print(f"✅ Image annotée enregistrée : {filename}")

# def preprocess_for_ocr(image_np):
#     """Prépare une image pour améliorer l’OCR avec Tesseract"""
#     image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
#     gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
#     blur = cv2.medianBlur(gray, 3)
#     thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

#     if DEBUG:
#         cv2.imwrite("ocr_debug.jpg", thresh)
#         print("🧪 Image prétraitée pour OCR sauvegardée sous 'ocr_debug.jpg'")

#     return thresh

@app.post("/verify")
async def verify_identity(image_id: UploadFile = File(...), image_selfie: UploadFile = File(...)):
    try:
        # Lire les fichiers image
        id_bytes = await image_id.read()
        selfie_bytes = await image_selfie.read()

        id_image = face_recognition.load_image_file(io.BytesIO(id_bytes))
        selfie_image = face_recognition.load_image_file(io.BytesIO(selfie_bytes))

        # LOGS
        print("\n== 📸 Début traitement images ==")
        print(f"🪪 Image ID - type: {type(id_image)}, shape: {getattr(id_image, 'shape', 'inconnu')}")
        print(f"🤳 Selfie - type: {type(selfie_image)}, shape: {getattr(selfie_image, 'shape', 'inconnu')}")

        if DEBUG:
            sauvegarder_visages(id_image, "id_debug.jpg")
            sauvegarder_visages(selfie_image, "selfie_debug.jpg")

        # Encodage facial
        id_encodings = face_recognition.face_encodings(id_image)
        selfie_encodings = face_recognition.face_encodings(selfie_image)

        print(f"🧠 Encodings ID: {len(id_encodings)} | Encodings Selfie: {len(selfie_encodings)}")

        # Vérifications
        if not id_encodings:
            return JSONResponse(
                content={"match": False, "error": "❌ Aucun visage détecté sur la carte d'identité"},
                status_code=400
            )

        if not selfie_encodings:
            return JSONResponse(
                content={"match": False, "error": "❌ Aucun visage détecté sur le selfie"},
                status_code=400
            )

        # Comparaison
        distance = face_recognition.face_distance([id_encodings[0]], selfie_encodings[0])[0]
        match = distance < 0.6  # Seuil configurable

        # OCR avec Tesseract
        ocr_result = reader.readtext(id_image)

        print("\n🔍 Résultats OCR complets :")
        for bbox, text, conf in ocr_result:
            print(f"  [{conf:.2f}] {text}")

        # Récupération des 2 dernières lignes détectées
        if len(ocr_result) >= 2:
            last_two_lines = [text for _, text, _ in ocr_result[-2:]]
            mrz_text = "\n".join(last_two_lines)
            print("\n✅ Zone MRZ détectée (2 dernières lignes OCR) :")
            print(mrz_text)
        else:
            mrz_text = ""
            print("❌ Pas assez de lignes OCR pour extraire la MRZ.")

        return {
            "match": bool(match),
            "distance": float(distance),
            "ocr_text": mrz_text
        }
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
