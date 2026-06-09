import pandas as pd
import io

COLUMNAS_ESPERADAS = {"Cliente", "Correo", "SKU", "Descripcion", "Cantidad", "Precio_Unitario"}

def parsear_excel(contenido: bytes) -> dict:
    df = pd.read_excel(io.BytesIO(contenido))

    columnas_presentes = set(df.columns.tolist())
    faltantes = COLUMNAS_ESPERADAS - columnas_presentes
    if faltantes:
        raise ValueError(f"Faltan estas columnas en el Excel: {faltantes}")

    df = df.dropna(subset=["SKU", "Cantidad", "Precio_Unitario"])
    df["Cantidad"] = df["Cantidad"].astype(int)
    df["Precio_Unitario"] = df["Precio_Unitario"].astype(float)

    # Cliente y correo se toman de la primera fila
    cliente = str(df["Cliente"].iloc[0])
    correo = str(df["Correo"].iloc[0]) if "Correo" in df.columns else None

    detalles = [
        {
            "sku": str(row["SKU"]),
            "descripcion": str(row["Descripcion"]) if pd.notna(row["Descripcion"]) else None,
            "cantidad": int(row["Cantidad"]),
            "precioUnitario": float(row["Precio_Unitario"]),
        }
        for _, row in df.iterrows()
    ]

    return {
        "cliente": cliente,
        "correo": correo,
        "detalles": detalles,
    }