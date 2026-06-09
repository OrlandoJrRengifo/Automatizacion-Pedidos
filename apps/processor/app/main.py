import base64
import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header, UploadFile, File
from pydantic import BaseModel
from app.parser import parsear_excel

load_dotenv()

app = FastAPI(
    title="Processador de Pedidos",
    description="Microservicio que recibe un Excel, lo parsea y lo manda al backend",
    version="1.0",
)

BACKEND_URL = os.getenv("BACKEND_URL")
API_KEY = os.getenv("API_KEY")


# --- Modelo para recibir desde Power Automate (base64) ---
class ExcelBase64(BaseModel):
    filename: str
    content: str  # base64


@app.get("/")
def health():
    return {"status": "ok"}


# para pruebas manuales
@app.post("/procesar-archivo")
async def procesar_archivo(
    file: UploadFile = File(...),
    x_api_key: str = Header(...),
):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="API key inválida")

    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Solo se aceptan archivos Excel")

    contenido = await file.read()
    return _procesar_y_enviar(contenido)


# --- Ruta 2: recibe base64 desde Power Automate ---
@app.post("/procesar-base64")
def procesar_base64(
    payload: ExcelBase64,
    x_api_key: str = Header(...),
):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="API key inválida")

    try:
        contenido = base64.b64decode(payload.content)
    except Exception:
        raise HTTPException(status_code=400, detail="El contenido base64 no es válido")

    return _procesar_y_enviar(contenido)


# --- Lógica compartida ---
def _procesar_y_enviar(contenido: bytes) -> dict:
    try:
        pedido = parsear_excel(contenido)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        respuesta = requests.post(
            f"{BACKEND_URL}/pedidos",
            json=pedido,
            headers={
                "x-api-key": API_KEY,
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        respuesta.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=502,
            detail=f"Error enviando al backend: {str(e)}"
        )

    return {
        "mensaje": "Pedido registrado correctamente",
        "pedido": respuesta.json(),
    }