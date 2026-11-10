#!/usr/bin/env python3
"""
Export ovk-snab.com catalog for migration to a modern stack.
Fetches products, categories, pages via public APIs and downloads unique images.
"""

from __future__ import annotations

import json
import re
import time
import hashlib
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

BASE_URL = "https://ovk-snab.com"
STORE_API = f"{BASE_URL}/wp-json/wc/store/v1/products"
WP_API = f"{BASE_URL}/wp-json/wp/v2"
ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
IMAGES_DIR = ROOT / "images" / "products"
META_DIR = ROOT / "meta"

PER_PAGE = 100
IMAGE_WORKERS = 8
REQUEST_DELAY = 0.15


def fetch_json(url: str, retries: int = 4) -> Any:
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "OVK-Export/1.0"})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=90) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
            if attempt == retries - 1:
                raise
            time.sleep(1.5 * (attempt + 1))
    return None


def fetch_paginated(base_url: str, per_page: int = PER_PAGE) -> list[Any]:
    page = 1
    items: list[Any] = []
    while True:
        sep = "&" if "?" in base_url else "?"
        url = f"{base_url}{sep}per_page={per_page}&page={page}"
        print(f"  GET page {page} ...", flush=True)
        batch = fetch_json(url)
        if not batch:
            break
        items.extend(batch)
        if len(batch) < per_page:
            break
        page += 1
        time.sleep(REQUEST_DELAY)
    return items


def normalize_image_base(url: str) -> str:
    return re.sub(r"-\d+x\d+(?=\.[a-zA-Z]+$)", "", url)


def extension_from_url(url: str) -> str:
    path = url.split("?")[0]
    match = re.search(r"\.(jpe?g|png|webp|gif)$", path, re.I)
    return match.group(1).lower() if match else "jpg"


def attributes_to_dict(attributes: list[dict]) -> dict[str, str]:
    result: dict[str, str] = {}
    for attr in attributes or []:
        name = (attr.get("name") or "").strip()
        terms = attr.get("terms") or []
        if not name or not terms:
            continue
        values = [t.get("name", "").strip() for t in terms if t.get("name")]
        if values:
            result[name] = ", ".join(values)
    return result


def extract_article(attrs: dict[str, str], name: str) -> str:
    for key in ("Артикул", "Номенклатурный номер", "Артикул производителя"):
        if attrs.get(key):
            return attrs[key].strip()
    tokens = name.split()
    if tokens:
        last = tokens[-1].strip()
        if re.match(r"^[A-Z0-9][A-Z0-9._-]{3,}$", last, re.I):
            return last
        if re.match(r"^\d{3}[A-Z]\d{4,}", last):
            return last
    return ""


def extract_brand(attrs: dict[str, str], name: str) -> str:
    if attrs.get("Бренд"):
        return attrs["Бренд"].strip()
    return ""


def download_image(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 0:
        return True
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "OVK-Export/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
        if not data:
            return False
        dest.write_bytes(data)
        return True
    except Exception as exc:
        print(f"    ! failed {dest.name}: {exc}", flush=True)
        return False


def transform_product(raw: dict, image_map: dict[str, str]) -> dict:
    attrs = attributes_to_dict(raw.get("attributes", []))
    article = extract_article(attrs, raw.get("name", ""))
    brand = extract_brand(attrs, raw.get("name", ""))
    prices = raw.get("prices") or {}

    image_url = ""
    image_local = ""
    image_key = ""
    images = raw.get("images") or []
    if images:
        image_url = images[0].get("src", "")
        image_key = normalize_image_base(image_url)
        image_local = image_map.get(image_key, "")

    categories = [
        {
            "id": c.get("id"),
            "name": c.get("name"),
            "slug": c.get("slug"),
        }
        for c in raw.get("categories", [])
    ]

    return {
        "id": raw.get("id"),
        "slug": raw.get("slug"),
        "name": raw.get("name"),
        "article": article,
        "brand": brand,
        "sku": (raw.get("sku") or "").strip(),
        "permalink": raw.get("permalink"),
        "price": int(prices.get("price") or 0),
        "regularPrice": int(prices.get("regular_price") or 0),
        "salePrice": int(prices.get("sale_price") or 0) if prices.get("sale_price") else None,
        "onSale": bool(raw.get("on_sale")),
        "inStock": (raw.get("stock_availability") or {}).get("text", ""),
        "description": raw.get("description") or "",
        "shortDescription": raw.get("short_description") or "",
        "categories": categories,
        "categoryIds": [c["id"] for c in categories if c.get("id")],
        "attributes": attrs,
        "image": {
            "url": image_url,
            "local": image_local,
            "key": image_key,
        },
        "tags": [t.get("name") for t in raw.get("tags", []) if t.get("name")],
    }


def build_category_tree(categories: list[dict]) -> list[dict]:
    by_parent: dict[int, list[dict]] = {}
    for cat in categories:
        by_parent.setdefault(cat.get("parent", 0), []).append(cat)

    def walk(parent_id: int = 0) -> list[dict]:
        nodes = []
        for cat in sorted(by_parent.get(parent_id, []), key=lambda c: c.get("name", "")):
            nodes.append(
                {
                    "id": cat.get("id"),
                    "name": cat.get("name"),
                    "slug": cat.get("slug"),
                    "parentId": cat.get("parent", 0),
                    "count": cat.get("count", 0),
                    "description": cat.get("description", ""),
                    "image": (cat.get("image") or ""),
                    "children": walk(cat.get("id")),
                }
            )
        return nodes

    return walk(0)


def transform_pages(pages: list[dict]) -> list[dict]:
    skip_slugs = {"cart-2", "checkout-2", "my-account-2", "wishlist", "compare", "catalog"}
    result = []
    for page in pages:
        slug = page.get("slug", "")
        if slug in skip_slugs:
            continue
        result.append(
            {
                "id": page.get("id"),
                "slug": slug,
                "title": page.get("title", {}).get("rendered", ""),
                "content": page.get("content", {}).get("rendered", ""),
                "excerpt": page.get("excerpt", {}).get("rendered", ""),
                "link": page.get("link"),
            }
        )
    return result


def main() -> None:
    started = time.time()
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)

    print("=== 1/4 Fetching products ===", flush=True)
    products_raw = fetch_paginated(STORE_API)
    print(f"  Products fetched: {len(products_raw)}", flush=True)

    print("=== 2/4 Fetching categories ===", flush=True)
    categories_raw = fetch_paginated(f"{WP_API}/product_cat")
    print(f"  Categories fetched: {len(categories_raw)}", flush=True)

    print("=== 3/4 Fetching pages ===", flush=True)
    pages_raw = fetch_paginated(f"{WP_API}/pages")
    pages = transform_pages(pages_raw)
    print(f"  Content pages kept: {len(pages)}", flush=True)

    print("=== 4/4 Downloading unique product images ===", flush=True)
    unique_images: dict[str, str] = {}
    for product in products_raw:
        images = product.get("images") or []
        if not images:
            continue
        src = images[0].get("src", "")
        if not src:
            continue
        base = normalize_image_base(src)
        if base not in unique_images:
            digest = hashlib.md5(base.encode()).hexdigest()[:12]
            ext = extension_from_url(src)
            unique_images[base] = f"images/products/{digest}.{ext}"

    print(f"  Unique images to download: {len(unique_images)}", flush=True)

    downloaded = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=IMAGE_WORKERS) as pool:
        futures = {}
        for url, rel_path in unique_images.items():
            dest = ROOT / rel_path
            futures[pool.submit(download_image, url, dest)] = (url, rel_path)
        for i, future in enumerate(as_completed(futures), 1):
            ok = future.result()
            if ok:
                downloaded += 1
            else:
                failed += 1
            if i % 100 == 0 or i == len(futures):
                print(f"  Progress: {i}/{len(futures)}", flush=True)

    image_map = dict(unique_images)

    print("=== Building normalized JSON ===", flush=True)
    products = [transform_product(p, image_map) for p in products_raw]
    categories_tree = build_category_tree(categories_raw)
    categories_flat = [
        {
            "id": c.get("id"),
            "name": c.get("name"),
            "slug": c.get("slug"),
            "parentId": c.get("parent", 0),
            "count": c.get("count", 0),
            "description": c.get("description", ""),
            "image": c.get("image") or "",
        }
        for c in categories_raw
    ]

    brands = sorted({p["brand"] for p in products if p["brand"]})

    with_article = sum(1 for p in products if p["article"])
    with_image = sum(1 for p in products if p["image"]["local"])

    catalog = {
        "source": BASE_URL,
        "exportedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "stats": {
            "products": len(products),
            "categories": len(categories_flat),
            "pages": len(pages),
            "brands": len(brands),
            "uniqueImages": len(unique_images),
            "productsWithArticle": with_article,
            "productsWithLocalImage": with_image,
        },
        "products": products,
    }

    (DATA_DIR / "catalog.json").write_text(
        json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (DATA_DIR / "categories.json").write_text(
        json.dumps({"flat": categories_flat, "tree": categories_tree}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (DATA_DIR / "pages.json").write_text(
        json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (DATA_DIR / "brands.json").write_text(
        json.dumps(brands, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    meta = {
        "source": BASE_URL,
        "exportedAt": catalog["exportedAt"],
        "durationSeconds": round(time.time() - started, 1),
        "stats": catalog["stats"],
        "imagesDownloaded": downloaded,
        "imagesFailed": failed,
        "dataFiles": [
            "data/catalog.json",
            "data/categories.json",
            "data/pages.json",
            "data/brands.json",
        ],
        "imageDir": "images/products/",
        "notes": {
            "article": "Normalized from attributes Артикул / Номенклатурный номер or product name suffix",
            "prices": "Integer RUB values from WooCommerce store API",
            "images": "Deduplicated by base URL; shared across similar products",
        },
    }
    (META_DIR / "export.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    print("\n=== Done ===", flush=True)
    print(json.dumps(meta, ensure_ascii=False, indent=2), flush=True)


if __name__ == "__main__":
    main()
