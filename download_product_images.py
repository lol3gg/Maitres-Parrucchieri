"""Download product images locally for GitHub Pages hosting."""
import json
import os
import re
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "assets", "products")
os.makedirs(OUT, exist_ok=True)

BASE = "https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products"
HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://maitresparrucchieri.beautycheck.it/",
}

# Fallback URLs for products without CDN image on BeautyCheck
OVERRIDES = {
    100: "https://cdn11.bigcommerce.com/s-dlmapwzuic/images/stencil/1280x1280/products/683/1147/Olaplex-3__84218.1706901184.jpg?c=1",
    127: "https://cdn11.bigcommerce.com/s-54lhv7i8/images/stencil/600x600/products/4814/10638/c1f57707-2185-40f7-b461-a6e815ef335b__24465.1765840213.jpg?c=2",
    125: "https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products/126/Images/1_Image.jpg",
    343: "https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products/118/Images/1_Image.jpg",
    640: "https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products/138/Images/1_Image.jpg",
    729: "https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products/138/Images/1_Image.jpg",
    642: "https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products/138/Images/1_Image.jpg",
    730: "https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products/138/Images/1_Image.jpg",
    265: "https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products/261/Images/1_Image.jpg",
    266: "https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products/261/Images/1_Image.jpg",
}

BC_IDS = [
    308, 307, 117, 118, 124, 383, 125, 126, 119, 343, 120, 106, 241, 105,
    640, 715, 712, 131, 133, 697, 135, 134, 716, 729, 642, 714, 713, 129,
    130, 730, 138, 349, 248, 661, 136, 95, 100, 128, 127, 97, 96, 101,
    271, 270, 261, 265, 304, 266,
]


def download(url, dest):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    if len(data) < 500:
        raise ValueError("file too small")
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


def scrape_bc_url(bc_id):
    # not used in batch — primary CDN path
    return f"{BASE}/{bc_id}/Images/1_Image.jpg"


results = {}
for bc_id in BC_IDS:
    dest = os.path.join(OUT, f"{bc_id}.jpg")
    urls = [f"{BASE}/{bc_id}/Images/1_Image.jpg"]
    if bc_id in OVERRIDES:
        urls.insert(0, OVERRIDES[bc_id].split("?")[0] if "areabeauty" in OVERRIDES[bc_id] else OVERRIDES[bc_id])

    ok = False
    for url in urls:
        try:
            size = download(url, dest)
            results[bc_id] = {"ok": True, "size": size, "url": url}
            print(f"OK {bc_id} ({size} bytes)")
            ok = True
            break
        except Exception as e:
            print(f"FAIL {bc_id} {url[:60]}... -> {e}")
    if not ok:
        results[bc_id] = {"ok": False}

with open(os.path.join(OUT, "manifest.json"), "w") as f:
    json.dump(results, f, indent=2)

failed = [k for k, v in results.items() if not v.get("ok")]
print("Failed:", failed)
