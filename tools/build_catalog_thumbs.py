"""Create lightweight WebP previews for the public catalog; originals stay untouched.

Run: python -m pip install Pillow
     python tools/build_catalog_thumbs.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "catalogo"
SOURCES = {
    "perla-nacar": "inv/assets/coleccion/perla-nacar.jpg",
    "encaje-marfil": "inv/assets/coleccion/encaje-marfil.jpg",
    "vitral-floral": "inv/assets/coleccion/vitral-floral.jpg",
    "villa-toscana": "inv/assets/coleccion/villa-toscana.jpg",
    "costa-azul": "inv/assets/coleccion/costa-azul.jpg",
    "gala-terciopelo": "inv/assets/coleccion/gala-terciopelo.jpg",
    "the-sacred-garden": "inv/assets/uploads/the-sacred-garden/20261122-233425-a4bc00c1-sobre-beige-con-sello-de-cera-roja-a-e.png",
}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, relpath in SOURCES.items():
        source = ROOT / relpath
        if not source.is_file():
            raise FileNotFoundError(f"Missing catalog cover: {source}")
        with Image.open(source) as original:
            picture = ImageOps.exif_transpose(original)
            if picture.mode not in ("RGB", "RGBA"):
                picture = picture.convert("RGBA" if "A" in picture.getbands() else "RGB")
            picture.thumbnail((600, 800), Image.Resampling.LANCZOS)
            destination = OUT / (name + ".webp")
            picture.save(destination, "WEBP", quality=76, method=6)
            print(f"{name}: {source.stat().st_size} -> {destination.stat().st_size} bytes")

if __name__ == "__main__":
    main()
