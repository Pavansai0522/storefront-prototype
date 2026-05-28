"""Remove logo backgrounds for PR Watches storefront assets."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

BLACK_THRESHOLD = 40
CREAM_RGB = (243, 236, 226)
CREAM_TOLERANCE = 32


def is_black(r: int, g: int, b: int, a: int) -> bool:
    return r <= BLACK_THRESHOLD and g <= BLACK_THRESHOLD and b <= BLACK_THRESHOLD


def is_cream(r: int, g: int, b: int, a: int) -> bool:
    if a < 128:
        return False
    dr = abs(r - CREAM_RGB[0])
    dg = abs(g - CREAM_RGB[1])
    db = abs(b - CREAM_RGB[2])
    if dr <= CREAM_TOLERANCE and dg <= CREAM_TOLERANCE and db <= CREAM_TOLERANCE:
        return True
    return r >= 238 and g >= 230 and b >= 218


def flood_component(
    start_x: int,
    start_y: int,
    mask: list[list[bool]],
    px,
    width: int,
    height: int,
    match,
) -> list[tuple[int, int]]:
    comp: list[tuple[int, int]] = []
    queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
    mask[start_y][start_x] = True

    while queue:
        x, y = queue.popleft()
        comp.append((x, y))
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and not mask[ny][nx]:
                r, g, b, a = px[nx, ny]
                if match(r, g, b, a):
                    mask[ny][nx] = True
                    queue.append((nx, ny))

    return comp


def remove_border_connected(
    img: Image.Image,
    match,
) -> int:
    width, height = img.size
    pixels = img.load()
    mask = [[False] * width for _ in range(height)]
    removed = 0

    seeds: list[tuple[int, int]] = []
    for x in range(width):
        seeds.append((x, 0))
        seeds.append((x, height - 1))
    for y in range(height):
        seeds.append((0, y))
        seeds.append((width - 1, y))

    for x, y in seeds:
        if mask[y][x]:
            continue
        r, g, b, a = pixels[x, y]
        if not match(r, g, b, a):
            continue
        component = flood_component(x, y, mask, pixels, width, height, match)
        for cx, cy in component:
            pixels[cx, cy] = (0, 0, 0, 0)
        removed += len(component)

    return removed


def process_prlogo3_cream(source: Path, destination: Path) -> int:
    img = Image.open(source).convert("RGBA")
    return remove_border_connected(img, is_cream)


def process_prlogo2_black(source: Path, destination: Path) -> int:
    img = Image.open(source).convert("RGBA")
    return remove_border_connected(img, is_black)


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    public = root / "watches-store-v2" / "public"

    prlogo3_source = Path(r"C:\Users\pavan\Downloads\prlogo3.jpg")
    if not prlogo3_source.exists():
        prlogo3_source = public / "prlogo3.jpg"

    prlogo3_dest = public / "prlogo3.png"
    img3 = Image.open(prlogo3_source).convert("RGBA")
    count3 = remove_border_connected(img3, is_cream)
    img3.save(prlogo3_dest, "PNG")
    print(f"Removed {count3} cream background pixels -> {prlogo3_dest}")

    prlogo2_source = Path(r"C:\Users\pavan\Downloads\prlogo2.png")
    if prlogo2_source.exists():
        img2 = Image.open(prlogo2_source).convert("RGBA")
        count2 = remove_border_connected(img2, is_black)
        img2.save(public / "prlogo2.png", "PNG")
        print(f"Removed {count2} black background pixels -> {public / 'prlogo2.png'}")
