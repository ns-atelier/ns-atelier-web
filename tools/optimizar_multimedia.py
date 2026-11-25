#!/usr/bin/env python3
"""Optimización conservadora del sitio público NYS Atelier.

No sustituye ni borra originales de fotos y audios de clientes.
El video nuevo se activa solamente cuando está subido correctamente.
Las subidas a Google Apps Script no pasan por este proceso.
"""
from __future__ import annotations
import hashlib
import json
import re
import shutil
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

def optimize_published_videos():
    # Identify the published masters by content, including copies under earlier URLs.
    # A replacement or an already optimized video will have a different checksum.
    profiles = {
        "7991ececea55089096996fc12d1b40b71e334bc67152cfa55f7d160389b85c2e": ("540:662", "24"),
        "1442fa71bd03e149ffafe40a4db50200960720d17797695a4af2d8808bcc34bc": ("480:588", "35"),
        "64e060cf2a2eb40cf81688f85005ae3507fc20e94befda03b123136558e0fb68": ("720:-2", "22"),
        "da912a2f3da4d3143709d19167b9c50820ab255af489edb6b55e8481bc0403ed": ("720:1280", "22"),
        "7b7b037beef2cf7de8528b994802edcba99e546eacf3ecd73b3f8df797411b49": (None, "22"),
    }
    paths = [
        V / "videohistorias-actual.mp4",
        V / "videohistorias-actual.webm",
        ROOT / "inv/assets/perla-nacar/intro-bridge.mp4",
        *(ROOT / "inv/assets/uploads").rglob("*.mp4"),
    ]
    batches: dict[str, list[Path]] = {}
    for path in paths:
        if path.is_file() and path.stat().st_size >= 2_000_000:
            with path.open("rb") as source:
                digest = hashlib.file_digest(source, "sha256").hexdigest()
            if digest in profiles:
                batches.setdefault(digest, []).append(path)

    for digest, copies in batches.items():
        original = copies[0]
        temporary = original.with_name(original.stem + ".optimized" + original.suffix)
        width_height, crf = profiles[digest]
        filters = ["-vf", f"scale={width_height}:flags=lanczos,setsar=1"] if width_height else []
        if original.suffix == ".webm":
            codec = ["-c:v", "libvpx-vp9", "-crf", crf, "-b:v", "0",
                     "-row-mt", "1", "-cpu-used", "4"]
        else:
            codec = ["-c:v", "libx264", "-crf", crf, "-preset", "slow",
                     "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
        try:
            command("ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                    "-i", str(original), "-map", "0:v:0", "-map", "0:a:0?",
                    *filters, *codec, "-threads", "2", "-c:a", "copy", str(temporary))
            old_duration, _, _ = video_info(original)
            new_duration, _, _ = video_info(temporary)
            new_size = temporary.stat().st_size
            if abs(old_duration - new_duration) >= 0.1 or new_size >= original.stat().st_size * 0.85:
                continue
            for target in copies:
                replacement = target.with_name(target.stem + ".compressing" + target.suffix)
                try:
                    saved = target.stat().st_size - new_size
                    shutil.copyfile(temporary, replacement)
                    replacement.replace(target)
                    print("Video publicado optimizado:", target.relative_to(ROOT), "ahorro bytes:", saved)
                finally:
                    replacement.unlink(missing_ok=True)
        finally:
            temporary.unlink(missing_ok=True)


def optimize_new_uploads():
    """Optimiza video y música nuevos sin cambiar su nombre o URL pública.

    No recodifica otra vez un archivo que acaba de procesar GitHub Actions.
    Los originales anteriores siguen recuperables desde el historial de Git.
    """
    try:
        subject = subprocess.check_output(
            ["git", "log", "-1", "--format=%s"], text=True).strip()
        if subject.startswith("Optimizar multimedia"):
            return
        changed = subprocess.check_output(
            ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD",
             "--", "inv/assets/uploads/"], text=True).splitlines()
    except (OSError, subprocess.CalledProcessError):
        return

    optimized = 0
    for relative in changed:
        path = (ROOT / relative).resolve()
        if not path.is_relative_to(ROOT / "inv" / "assets" / "uploads"):
            continue
        if not path.is_file() or path.stat().st_size < 1_000_000:
            continue
        suffix = path.suffix.lower()
        # WebM puede tener canal alfa (pétalos y adornos); no lo re-codificamos.
        if suffix not in (".mp4", ".mp3", ".m4a"):
            continue
        temp = path.with_name(path.stem + ".compressing" + suffix)
        try:
            if suffix == ".mp4":
                original_duration, width, height = video_info(path)
                # H.264/AAC compatible con móviles, CRF 21 = calidad alta.
                command("ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                    "-i", str(path), "-map", "0:v:0", "-map", "0:a:0?",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "21",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
                    "-movflags", "+faststart", str(temp))
                new_duration, new_width, new_height = video_info(temp)
                valid = (abs(new_duration - original_duration) < 1.0
                         and width == new_width and height == new_height)
            elif suffix == ".mp3":
                command("ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                    "-i", str(path), "-vn", "-c:a", "libmp3lame", "-q:a", "3", str(temp))
                valid = True
            else:
                command("ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                    "-i", str(path), "-vn", "-c:a", "aac", "-b:a", "160k", str(temp))
                valid = True
            # Solo sustituir si hay una mejora importante. La URL no cambia.
            if valid and temp.stat().st_size < path.stat().st_size * .82:
                saved = path.stat().st_size - temp.stat().st_size
                temp.replace(path)
                optimized += 1
                print("Medio comprimido:", relative, "ahorro bytes:", saved)
        except (OSError, subprocess.CalledProcessError, ValueError) as exc:
            print("No fue posible comprimir", relative, str(exc))
        finally:
            temp.unlink(missing_ok=True)
    print("Videos/audios recién subidos y optimizados:", optimized)


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
    optimize_published_videos()
    optimize_new_uploads()
    images_to_webp()
    audio_to_opus()
    switch_static_images()
    print("Completado. Los originales de invitaciones permanecen disponibles.")
