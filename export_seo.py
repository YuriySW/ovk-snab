#!/usr/bin/env python3
"""Export Yoast SEO metadata from ovk-snab.com WordPress REST API."""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

BASE_URL = "https://ovk-snab.com"
WP_API = f"{BASE_URL}/wp-json/wp/v2"
ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
META_DIR = ROOT / "meta"

PER_PAGE = 100
REQUEST_DELAY = 0.12
SKIP_PAGE_SLUGS = {"cart-2", "checkout-2", "my-account-2", "wishlist", "compare", "catalog"}


def fetch_json(url: str, retries: int = 4) -> Any:
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "OVK-Export/1.0"})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
            if attempt == retries - 1:
                raise
            time.sleep(1.5 * (attempt + 1))
    return None


def fetch_paginated(endpoint: str) -> list[dict]:
    page = 1
    items: list[dict] = []
    while True:
        url = f"{WP_API}/{endpoint}?per_page={PER_PAGE}&page={page}"
        print(f"  GET {endpoint} page {page} ...", flush=True)
        batch = fetch_json(url)
        if not batch:
            break
        items.extend(batch)
        if len(batch) < PER_PAGE:
            break
        page += 1
        time.sleep(REQUEST_DELAY)
    return items


def og_images(yoast: dict) -> list[str]:
    images = yoast.get("og_image") or []
    urls: list[str] = []
    for item in images:
        if isinstance(item, dict) and item.get("url"):
            urls.append(item["url"])
        elif isinstance(item, str):
            urls.append(item)
    return urls


def extract_breadcrumbs(schema: dict | None) -> list[dict]:
    if not schema:
        return []
    for node in schema.get("@graph", []):
        if node.get("@type") == "BreadcrumbList":
            return [
                {
                    "position": el.get("position"),
                    "name": el.get("name"),
                    "url": el.get("item"),
                }
                for el in node.get("itemListElement", [])
            ]
    return []


def extract_seo(item: dict, item_type: str) -> dict:
    yoast = item.get("yoast_head_json") or {}
    link = item.get("link") or ""
    slug = item.get("slug") or ""

    if item_type == "page":
        title = (item.get("title") or {}).get("rendered", "")
    else:
        title = item.get("name") or slug

    return {
        "id": item.get("id"),
        "slug": slug,
        "url": link,
        "name": title,
        "seo": {
            "title": yoast.get("title") or "",
            "description": yoast.get("description") or "",
            "canonical": yoast.get("canonical") or link,
            "robots": yoast.get("robots") or {},
            "og": {
                "title": yoast.get("og_title") or "",
                "description": yoast.get("og_description") or "",
                "url": yoast.get("og_url") or link,
                "type": yoast.get("og_type") or "",
                "locale": yoast.get("og_locale") or "",
                "siteName": yoast.get("og_site_name") or "",
                "images": og_images(yoast),
            },
            "twitter": {
                "card": yoast.get("twitter_card") or "",
            },
            "schema": yoast.get("schema"),
            "breadcrumbs": extract_breadcrumbs(yoast.get("schema")),
        },
    }


def main() -> None:
    started = time.time()
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)

    print("=== Fetching product SEO ===", flush=True)
    products_raw = fetch_paginated("product")
    products = [extract_seo(p, "product") for p in products_raw]
    print(f"  Products: {len(products)}", flush=True)

    print("=== Fetching category SEO ===", flush=True)
    categories_raw = fetch_paginated("product_cat")
    categories = [extract_seo(c, "category") for c in categories_raw]
    print(f"  Categories: {len(categories)}", flush=True)

    print("=== Fetching page SEO ===", flush=True)
    pages_raw = fetch_paginated("pages")
    pages = [extract_seo(p, "page") for p in pages_raw if p.get("slug") not in SKIP_PAGE_SLUGS]
    print(f"  Pages: {len(pages)}", flush=True)

    with_title = sum(1 for p in products if p["seo"]["title"])
    with_desc = sum(1 for p in products if p["seo"]["description"])

    seo = {
        "source": BASE_URL,
        "exportedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "stats": {
            "products": len(products),
            "categories": len(categories),
            "pages": len(pages),
            "productsWithMetaTitle": with_title,
            "productsWithMetaDescription": with_desc,
        },
        "products": products,
        "categories": categories,
        "pages": pages,
    }

    by_slug = {
        "products": {p["slug"]: p["seo"] for p in products if p.get("slug")},
        "categories": {c["slug"]: c["seo"] for c in categories if c.get("slug")},
        "pages": {p["slug"]: p["seo"] for p in pages if p.get("slug")},
    }

    (DATA_DIR / "seo.json").write_text(json.dumps(seo, ensure_ascii=False, indent=2), encoding="utf-8")
    (DATA_DIR / "seo-by-slug.json").write_text(json.dumps(by_slug, ensure_ascii=False, indent=2), encoding="utf-8")

    meta_path = META_DIR / "export.json"
    meta = {}
    if meta_path.exists():
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
    meta["seoExportedAt"] = seo["exportedAt"]
    meta["seoStats"] = seo["stats"]
    meta["seoFiles"] = ["data/seo.json", "data/seo-by-slug.json"]
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    print("\n=== Done ===", flush=True)
    print(f"  data/seo.json — {len(products)} products, {len(categories)} categories, {len(pages)} pages")
    print(f"  Meta title filled: {with_title}/{len(products)}")
    print(f"  Meta description filled: {with_desc}/{len(products)}")
    print(f"  Duration: {time.time() - started:.1f}s", flush=True)


if __name__ == "__main__":
    main()
