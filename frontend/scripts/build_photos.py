#!/usr/bin/env python3
"""
Build the Hobbies photo wall's assets from original camera files, and print the
EXIF as ready-to-paste `meta` blocks for `components/Hobbies/index.tsx`.

    python3 scripts/build_photos.py ~/Desktop/photos/*.jpg

Each source produces the site's two-size WebP pair in public/photos:
    <name>.webp        long edge 2200px — the full-screen viewer
    <name>-thumb.webp  long edge  760px — the square grid

Uses PIL rather than sips/cwebp on purpose: some originals carry an EXIF
orientation flag that both of those tools silently drop, which bakes a 90°
rotation into the output. `ImageOps.exif_transpose` applies it first.

Note the WebPs are written without EXIF, so camera bodies, timestamps, and
serial numbers stay out of the deployed site — anything you want shown has to
go through the `meta` block, deliberately.
"""
import argparse
import os
import re
import struct
import sys

try:
    from PIL import Image, ImageOps, ExifTags
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install pillow")

DEFAULT_OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "photos")
TAG = {name: num for num, name in ExifTags.TAGS.items()}


def slug(path):
    stem = os.path.splitext(os.path.basename(path))[0]
    return "".join(c if c.isalnum() else "-" for c in stem.lower()).strip("-")


def fit(im, longest):
    """Scale so the longest edge is `longest`. Never upscale."""
    w, h = im.size
    if max(w, h) <= longest:
        return im
    scale = longest / max(w, h)
    return im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)


def camera_name(make, model):
    """'NIKON CORPORATION' + 'NIKON D5600' -> 'Nikon D5600'."""
    make, model = (make or "").strip(), (model or "").strip()
    if not model:
        return make.title() or None
    # Apple's model is already the product name — 'Apple iPhone 11' reads wrong.
    if make.lower() == "apple":
        return model
    brand = make.split()[0] if make else ""
    if brand and model.upper().startswith(brand.upper()):
        rest = model[len(brand):].strip()
        return f"{brand.title()} {rest}".strip()
    return f"{make.title()} {model}".strip() if make else model


def apple_lens(lens_model, camera_model):
    """
    'iPhone 11 back dual wide camera 4.25mm f/1.8' -> 'Back dual wide camera'.
    The body, focal length, and aperture all have their own rows, so the raw
    string is mostly redundant — keep just which camera on the phone it was.
    """
    text = (lens_model or "").strip()
    if not text:
        return None
    if camera_model and text.lower().startswith(camera_model.lower()):
        text = text[len(camera_model):].strip()
    text = re.sub(r"\s*[\d.]+\s*mm\s*f/[\d.]+\s*$", "", text).strip()
    return text[:1].upper() + text[1:] if text else None


def nikon_lens(maker_note):
    """
    Nikon's MakerNote is a TIFF block whose tag 0x0084 holds the mounted lens as
    [minFocal, maxFocal, apertureAtMin, apertureAtMax] -> '18-400 mm f/3.5-6.3'.
    Bodies like the D5600 don't write the plain EXIF LensModel tag, so without
    this the Nikon frames would show no lens at all.
    """
    if not maker_note or not maker_note.startswith(b"Nikon\x00"):
        return None
    base = 10                                   # "Nikon\0" + version, then a TIFF header
    try:
        order = "<" if maker_note[base:base + 2] == b"II" else ">"
        offset = struct.unpack_from(order + "I", maker_note, base + 4)[0]
        p = base + offset
        count = struct.unpack_from(order + "H", maker_note, p)[0]
        p += 2
        for _ in range(count):
            tag, typ, cnt, raw = struct.unpack_from(order + "HHI4s", maker_note, p)
            p += 12
            if tag == 0x0084 and typ == 5 and cnt == 4:
                at = struct.unpack_from(order + "I", raw)[0] + base
                n = struct.unpack_from(order + "8I", maker_note, at)
                fmin, fmax, amin, amax = (n[i] / n[i + 1] for i in range(0, 8, 2))
                focal = f"{fmin:g} mm" if fmin == fmax else f"{fmin:g}–{fmax:g} mm"
                stop = f"f/{amin:g}" if amin == amax else f"f/{amin:g}–{amax:g}"
                return f"{focal} {stop}"
    except (struct.error, ZeroDivisionError, IndexError):
        return None
    return None


def shutter(exposure):
    if not exposure:
        return None
    t = float(exposure)
    if t >= 1:
        return f"{t:g} s"
    return f"1/{round(1 / t)} s"


def read_meta(im):
    """Pull the handful of EXIF fields worth showing beside a photo."""
    exif = im.getexif()
    if not exif:
        return []
    sub = exif.get_ifd(0x8769)

    def g(name):
        return sub.get(TAG.get(name)) if TAG.get(name) in sub else exif.get(TAG.get(name))

    rows = []

    def add(label, value):
        if value not in (None, "", 0):
            rows.append((label, str(value)))

    model = exif.get(TAG["Model"])
    add("Camera", camera_name(exif.get(TAG["Make"]), model))
    # phones write LensModel; Nikon bodies hide it in the MakerNote
    add("Lens", apple_lens(g("LensModel"), model) or nikon_lens(g("MakerNote")))

    focal, focal35 = g("FocalLength"), g("FocalLengthIn35mmFilm")
    if focal:
        text = f"{float(focal):g} mm"
        if focal35 and round(float(focal)) != int(focal35):
            text += f" · {int(focal35)} mm eq."
        add("Focal length", text)

    add("Shutter", shutter(g("ExposureTime")))
    if g("FNumber"):
        add("Aperture", f"f/{float(g('FNumber')):g}")

    iso = g("ISOSpeedRatings") or g("PhotographicSensitivity")
    add("ISO", iso if not isinstance(iso, tuple) else iso[0])

    taken = g("DateTimeOriginal") or exif.get(TAG["DateTime"])
    if taken:
        try:
            date, _ = str(taken).split(" ", 1)
            y, m, d = (int(p) for p in date.split(":"))
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            add("Taken", f"{d} {months[m - 1]} {y}")
        except (ValueError, IndexError):
            add("Taken", taken)

    return rows


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("sources", nargs="+", help="original image files")
    ap.add_argument("--out", default=DEFAULT_OUT, help="output directory (default: public/photos)")
    ap.add_argument("--full-max", type=int, default=2200)
    ap.add_argument("--thumb-max", type=int, default=760)
    ap.add_argument("--quality", type=int, default=86, help="full-size WebP quality")
    ap.add_argument("--thumb-quality", type=int, default=74, help="thumbnail WebP quality")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    emitted = []

    for src in args.sources:
        name = slug(src)
        im = Image.open(src)
        rotated = im.getexif().get(TAG["Orientation"]) not in (None, 1)
        meta = read_meta(im)                       # read before transpose drops the tags
        im = ImageOps.exif_transpose(im).convert("RGB")

        full_path = os.path.join(args.out, f"{name}.webp")
        thumb_path = os.path.join(args.out, f"{name}-thumb.webp")
        full = fit(im, args.full_max)
        full.save(full_path, "WEBP", quality=args.quality, method=6)
        fit(im, args.thumb_max).save(thumb_path, "WEBP", quality=args.thumb_quality, method=6)

        print(
            f"{name:<16} {str(full.size):<14}"
            f" full {os.path.getsize(full_path) // 1024:>4}KB"
            f"  thumb {os.path.getsize(thumb_path) // 1024:>3}KB"
            f"{'  [EXIF rotation applied]' if rotated else ''}"
            f"{'' if meta else '  [no EXIF in source]'}",
            file=sys.stderr,
        )
        # The source's folder becomes the category — emitted once, then it lives
        # hard-coded in the component; nothing reads paths at runtime.
        category = os.path.basename(os.path.dirname(os.path.abspath(src))).title()
        emitted.append((name, category, meta))

    # paste-ready blocks for the `photos` array
    print("\n/* ---- paste into components/Hobbies/index.tsx ---- */")
    for name, category, meta in emitted:
        print(f"  // {name}")
        print(f'    category: "{category}",')
        if not meta:
            print("  // (source carried no EXIF — no meta block)")
            continue
        print("    meta: [")
        for label, value in meta:
            print(f'      {{ label: "{label}", value: "{value}" }},')
        print("    ],")


if __name__ == "__main__":
    main()
