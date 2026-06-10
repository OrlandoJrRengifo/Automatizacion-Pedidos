import pandas as pd
import io

COLUMNAS_ESPERADAS = {"Cliente", "Correo", "SKU", "Descripcion", "Cantidad", "Precio_Unitario"}

def parsear_excel(contenido: bytes) -> dict:
    df = pd.read_excel(io.BytesIO(contenido), engine="openpyxl")

    columnas_presentes = set(df.columns.tolist())
    faltantes = COLUMNAS_ESPERADAS - columnas_presentes
    if faltantes:
        raise ValueError(f"Faltan estas columnas en el Excel: {faltantes}")

    df = df.dropna(subset=["SKU", "Cantidad", "Precio_Unitario"])
    
    # Validar que el DataFrame no haya quedado vacío tras el dropna
    if df.empty:
        raise ValueError("El archivo Excel no contiene registros válidos de pedidos.")

    df["Cantidad"] = df["Cantidad"].astype(int)
    df["Precio_Unitario"] = df["Precio_Unitario"].astype(float)

    # Cliente y correo se toman de la primera fila de forma segura
    cliente = str(df["Cliente"].iloc[0]) if pd.notna(df["Cliente"].iloc[0]) else "Cliente Desconocido"
    correo = str(df["Correo"].iloc[0]) if "Correo" in df.columns and pd.notna(df["Correo"].iloc[0]) else None

    detalles = [
        {
            "sku": str(row["SKU"]),
            "descripcion": str(row["Descripcion"]) if pd.notna(row["Descripcion"]) else None,
            "cantidad": int(row["Cantidad"]),
            "precioUnitario": float(row["Precio_Unitario"]),
        }
        # Filtrado rápido por si se cuelan filas con índices corruptos
        for _, row in df.iterrows() if pd.notna(row["SKU"])
    ]

    return {
        "cliente": cliente,
        "correo": correo,
        "detalles": detalles,
    }