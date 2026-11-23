#!/usr/bin/env python3
"""Optimización conservadora del sitio público NYS Atelier.

No sustituye ni borra originales de fotos y audios de clientes.
El video nuevo se activa solamente cuando está subido correctamente.
Las subidas a Google Apps Script no pasan por este proceso.
"""
from __future__ import annotations
import json
import re
import subprocess
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
FOLDERS = [ROOT / "assets", ROOT / "images", ROOT / "inv" / "assets", ROOT / "i"]
V = ROOT / "assets" / "videohistorias"

def command(*parts):
    subprocess.run(parts, check=True, stdout=subprocess.DEVNULL)

def video_info(path):
    result = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration:stream=codec_type,width,height", "-of", "json", str(path)
    ], text=True)
    data = json.loads(result)
    stream = next(s for s in data["streams"] if s["codec_type"] == "video")
    return float(data["format"]["duration"]), int(stream["width"]), int(stream["height"])

def try_webm(video):
    out = video.with_suffix(".webm")
    temp = video.with_suffix(".tmp.webm")
    try:
        command("ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
            "-i", str(video), "-map", "0:v:0", "-map", "0:a:0?",
            "-c:v", "libvpx-vp9", "-deadline", "good", "-cpu-used", "6",
            "-threads", "4", "-row-mt", "1", "-b:v", "0", "-crf", "38",
            "-c:a", "libopus", "-b:a", "96k", str(temp))
        if temp.stat().st_size < video.stat().st_size * .88:
            temp.replace(out)
            return True
    except (OSError, subprocess.CalledProcessError) as exc:
        print("WebM no disponible:", exc)
    finally:
        temp.unlink(missing_ok=True)
    out.unlink(missing_ok=True)
    return False

def activate_video():
    incoming = V / "video-nuevo.mp4"
    if not incoming.is_file():
        return
    duration, width, height = video_info(incoming)
    if duration < 2 or width < 320 or height < 240 or incoming.stat().st_size > 95_000_000:
        raise ValueError("Video inválido: comprueba el archivo nuevo.")
    destination = V / "videohistorias-actual.mp4"
    temp = V / "videohistorias-actual.tmp.mp4"
    # Remux sin pérdida: cambia estructura para reproducción web, no los píxeles ni el audio.
    command("ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
        "-i", str(incoming), "-map", "0:v:0", "-map", "0:a:0?",
        "-c", "copy", "-movflags", "+faststart", str(temp))
    temp.replace(destination)
    poster = V / "videohistorias-actual.webp"
    command("ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
        "-ss", str(min(3, duration / 4)), "-i", str(destination),
        "-frames:v", "1", "-vf", "scale=800:-2", "-c:v", "libwebp",
        "-quality", "85", str(poster))
    has_webm = try_webm(destination)
    sources = ('              <source src="assets/videohistorias/videohistorias-actual.webm" type="video/webm">\n' if has_webm else '')
    sources += '              <source src="assets/videohistorias/videohistorias-actual.mp4" type="video/mp4">\n'
    player = ('<video id="videoHistorias" controls loop playsinline preload="none" '
              f'width="{width}" height="{height}"\n'
              '              poster="assets/videohistorias/videohistorias-actual.webp" '
              'aria-label="Muestra de una videohistoria 3D">\n'
              + sources + '            </video>')
    index = ROOT / "index.html"
    html = index.read_text(encoding="utf-8")
    html, n = re.subn(r'<video\s+id="videoHistorias"[\s\S]*?</video>', lambda m: player, html, count=1)
    if n != 1:
        raise RuntimeError("No se encontró el reproductor de Videohistorias")
    html = re.sub(r'(\.video3d-figure video\s*\{[^}]*?aspect-ratio:)\s*3\s*/\s*4',
                  lambda m: f'{m.group(1)} {width} / {height}', html, count=1)
    secs = round(duration)
    html = re.sub(r'(<figcaption><span>Del personaje a la escena animada</span><time )datetime="[^"]*">[^<]*',
                  lambda m: f'{m.group(1)}datetime="PT{secs}S">{secs//60}:{secs%60:02d}', html, count=1)
    video_info(destination)
    index.write_text(html, encoding="utf-8")
    for old in [V / "videohistorias-34s.mp4", V / "historias-3d.mp4"]:
        old.unlink(missing_ok=True)
    incoming.unlink()
    print(f"Video nuevo activo: {duration:.2f}s {width}x{height}; WebM ligero: {has_webm}")

def images_to_webp():
    created = 0
    for directory in FOLDERS:
        if not directory.is_dir():
            continue
        for src in directory.rglob("*"):
            if src.suffix.lower() not in (".jpg", ".jpeg", ".png"):
                continue
            dest = src.with_suffix(".webp")
            if dest.exists():
                continue
            temp = src.with_suffix(".tmp.webp")
            try:
                with Image.open(src) as original:
                    image = ImageOps.exif_transpose(original)
                    if image.mode not in ("RGB", "RGBA"):
                        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
                    # Nunca cambia el tamaño en píxeles; las transparencias, sin pérdida.
                    if image.mode == "RGBA":
                        image.save(temp, "WEBP", lossless=True, method=5)
                    else:
                        image.save(temp, "WEBP", quality=90, method=5)
                if temp.stat().st_size < src.stat().st_size * .94:
                    temp.replace(dest)
                    created += 1
            except Exception as error:
                print("Imagen no optimizada:", src.relative_to(ROOT), error)
            finally:
                temp.unlink(missing_ok=True)
    print("Imágenes WebP nuevas:", created)

def audio_to_opus():
    created = 0
    for directory in FOLDERS:
        if not directory.is_dir():
            continue
        for src in directory.rglob("*"):
            if src.suffix.lower() not in (".mp3", ".wav"):
                continue
            dest = src.with_suffix(".opus")
            if dest.exists():
                continue
            temp = src.with_suffix(".tmp.opus")
            try:
                command("ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                    "-i", str(src), "-vn", "-c:a", "libopus", "-b:a", "112k", str(temp))
                if temp.stat().st_size < src.stat().st_size * .90:
                    temp.replace(dest)
                    created += 1
            except Exception as error:
                print("Audio no optimizado:", src.relative_to(ROOT), error)
            finally:
                temp.unlink(missing_ok=True)
    print("Audios Opus nuevos:", created)

def switch_static_images():
    # Sólo imágenes estáticas: no se alteran URLs de clientes recibidas desde el panel.
    matcher = re.compile(r'(?P<left>\b(?:src|poster)\s*=\s*["\x27])(?P<path>[^"\x27]+?\.(?:png|jpe?g))(?P<right>["\x27])', re.I)
    for file in ROOT.rglob("*.html"):
        if ".git" in file.parts:
            continue
        initial = file.read_text(encoding="utf-8")
        def resolve(match):
            value = match.group("path")
            if value.startswith(("/", "http:", "https:", "data:")):
                return match.group(0)
            source = (file.parent / value).resolve()
            if not source.is_relative_to(ROOT) or not source.with_suffix(".webp").is_file():
                return match.group(0)
            new_url = value.rsplit(".", 1)[0] + ".webp"
            return match.group("left") + new_url + match.group("right")
        updated = matcher.sub(resolve, initial)
        if updated != initial:
            file.write_text(updated, encoding="utf-8")
            print("Referencias de imágenes optimizadas:", file.relative_to(ROOT))

if __name__ == "__main__":
    activate_video()
    images_to_webp()
    audio_to_opus()
    switch_static_images()
    print("Completado. Los originales de invitaciones permanecen disponibles.")
