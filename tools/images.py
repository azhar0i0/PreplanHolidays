"""Image pipeline.

  python tools/images.py photos   -> download the Unsplash originals listed in src/photos.json
                                     into images/photos/<name>.jpg (1600px, skipped if present)
                                     and generate 1600/960/480 WebP renditions
  python tools/images.py hotels   -> WebP renditions for images/hotels/*.jpg
  python tools/images.py og       -> 1200x630 Open Graph images from src/og-manifest.json
  python tools/images.py icons    -> favicon.ico, icon.svg, manifest icons from images/favicon.png
  python tools/images.py all
"""
import io, json, os, sys, urllib.request
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTOS = os.path.join(ROOT, "images", "photos")
HOTELS = os.path.join(ROOT, "images", "hotels")
OG = os.path.join(ROOT, "images", "og")
SIZES = [1600, 960, 480]
UA = {"User-Agent": "Mozilla/5.0 (PreplanHolidays site build)"}

def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def renditions(src_path, out_dir, name):
    im = Image.open(src_path).convert("RGB")
    w, h = im.size
    for s in SIZES:
        out = os.path.join(out_dir, f"{name}-{s}.webp")
        if os.path.exists(out):
            continue
        if w > s:
            r = im.resize((s, round(h * s / w)), Image.LANCZOS)
        else:
            r = im.copy()
        r.save(out, "WEBP", quality=78, method=6)
    return w, h

def photos():
    os.makedirs(PHOTOS, exist_ok=True)
    mapping = json.load(open(os.path.join(ROOT, "src", "photos.json"), encoding="utf-8"))
    meta = {}
    for pid, info in mapping.items():
        name = info["file"]
        jpg = os.path.join(PHOTOS, f"{name}.jpg")
        if not os.path.exists(jpg):
            url = f"https://images.unsplash.com/{pid}?fm=jpg&w=1600&q=82&fit=max"
            try:
                data = fetch(url)
                im = Image.open(io.BytesIO(data)).convert("RGB")
                im.save(jpg, "JPEG", quality=85, optimize=True, progressive=True)
                print("downloaded", name, im.size)
            except Exception as e:
                print("FAILED", pid, e)
                continue
        w, h = renditions(jpg, PHOTOS, name)
        meta[pid] = {"file": name, "w": w, "h": h}
    json.dump(meta, open(os.path.join(ROOT, "src", "photos-meta.json"), "w"), indent=1)
    print("photos done", len(meta))

def hotels():
    for f in sorted(os.listdir(HOTELS)):
        if f.lower().endswith(".jpg"):
            renditions(os.path.join(HOTELS, f), HOTELS, f[:-4])
    print("hotels done")

def font(size, bold=True):
    for cand in ["C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]:
        if os.path.exists(cand):
            return ImageFont.truetype(cand, size)
    return ImageFont.load_default()

def wrap(draw, text, fnt, maxw):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        t = (cur + " " + wd).strip()
        if draw.textlength(t, font=fnt) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = wd
    if cur: lines.append(cur)
    return lines

def og():
    os.makedirs(OG, exist_ok=True)
    manifest = json.load(open(os.path.join(ROOT, "src", "og-manifest.json"), encoding="utf-8"))
    logo = Image.open(os.path.join(ROOT, "images", "logo-light.png")).convert("RGBA")
    lw = 300; logo = logo.resize((lw, round(logo.size[1] * lw / logo.size[0])), Image.LANCZOS)
    W, H = 1200, 630
    for item in manifest:
        out = os.path.join(OG, item["out"])
        src = os.path.join(ROOT, item["photo"].lstrip("/"))
        if not os.path.exists(src):
            print("missing photo for og", item["out"], src); continue
        im = Image.open(src).convert("RGB")
        w, h = im.size
        scale = max(W / w, H / h)
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        x = (im.size[0] - W) // 2; y = (im.size[1] - H) // 2
        im = im.crop((x, y, x + W, y + H))
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        for i in range(H):
            a = int(max(0, (i - H * 0.35) / (H * 0.65)) ** 1.2 * 235)
            od.line([(0, i), (W, i)], fill=(3, 32, 31, a))
        od.rectangle([(0, 0), (W, H)], fill=(3, 32, 31, 40))
        im = Image.alpha_composite(im.convert("RGBA"), overlay)
        d = ImageDraw.Draw(im)
        title = item["title"]
        fnt = font(58)
        lines = wrap(d, title, fnt, W - 120)
        if len(lines) > 2:
            fnt = font(46); lines = wrap(d, title, fnt, W - 120)[:3]
        lh = fnt.size * 1.18
        ty = H - 70 - lh * len(lines) - 6
        if item.get("kicker"):
            kf = font(26, bold=True)
            d.rounded_rectangle([(60, ty - 56), (60 + d.textlength(item["kicker"], font=kf) + 36, ty - 14)], radius=20, fill=(253, 193, 0, 255))
            d.text((78, ty - 50), item["kicker"], font=kf, fill=(7, 36, 35, 255))
        for i, ln in enumerate(lines):
            d.text((60, ty + i * lh), ln, font=fnt, fill=(255, 255, 255, 255))
        im.alpha_composite(logo, (W - lw - 60, 48))
        im.convert("RGB").save(out, "JPEG", quality=84, optimize=True, progressive=True)
    print("og done", len(manifest))

def icons():
    src = Image.open(os.path.join(ROOT, "images", "apple-touch-icon.png")).convert("RGBA")
    for s in (192, 512):
        src.resize((s, s), Image.LANCZOS).save(os.path.join(ROOT, "images", f"icon-{s}.png"), "PNG")
    fav = Image.open(os.path.join(ROOT, "images", "favicon.png")).convert("RGBA")
    fav.save(os.path.join(ROOT, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    # SVG wrapper around the PNG so browsers that prefer SVG icons still get the mark
    import base64
    b64 = base64.b64encode(open(os.path.join(ROOT, "images", "favicon.png"), "rb").read()).decode()
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64"><image width="64" height="64" xlink:href="data:image/png;base64,{b64}"/></svg>'
    open(os.path.join(ROOT, "images", "icon.svg"), "w", encoding="utf-8").write(svg)
    print("icons done")

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "all"
    if cmd in ("photos", "all"): photos()
    if cmd in ("hotels", "all"): hotels()
    if cmd in ("icons", "all"): icons()
    if cmd in ("og", "all"): og()
