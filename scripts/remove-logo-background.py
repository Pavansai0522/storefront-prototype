"""Remove outer and enclosed black backgrounds from PR logo PNG."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

THRESHOLD = 40


def is_black(r: int, g: int, b: int, a: int) -> bool:
    return r <= THRESHOLD and g <= THRESHOLD and b <= THRESHOLD


def flood_component(
    start_x: int,
    start_y: int,
    mask: list[list[bool]],
    px,
    width: int,
    height: int,
) -> tuple[list[tuple[int, int]], bool]:
    comp: list[tuple[int, int]] = []
    queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
    mask[start_y][start_x] = True
    touches_border = start_x == 0 or start_y == 0 or start_x == width - 1 or start_y == height - 1

    while queue:
        x, y = queue.popleft()
        comp.append((x, y))
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and not mask[ny][nx]:
                r, g, b, a = px[nx, ny]
                if is_black(r, g, b, a):
                    mask[ny][nx] = True
                    if nx == 0 or ny == 0 or nx == width - 1 or ny == height - 1:
                        touches_border = True
                    queue.append((nx, ny))

    return comp, touches_border


def process_logo(source: Path, destination: Path) -> int:
    img = Image.open(source).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    mask = [[False] * width for _ in range(height)]
    removed = 0

    for y in range(height):
        for x in range(width):
            if mask[y][x]:
                continue
            r, g, b, a = pixels[x, y]
            if not is_black(r, g, b, a):
                continue

            component, _touches_border = flood_component(x, y, mask, pixels, width, height)

            for cx, cy in component:
                r, g, b, a = pixels[cx, cy]
                pixels[cx, cy] = (r, g, b, 0)
            removed += len(component)

    img.save(destination, "PNG")
    return removed


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    source = Path(r"C:\Users\pavan\Downloads\prlogo2.png")
    if not source.exists():
        source = root / "watches-store-v2" / "public" / "prlogo2.png"

    destination = root / "watches-store-v2" / "public" / "prlogo2.png"
    count = process_logo(source, destination)
    print(f"Removed {count} background black pixels -> {destination}")
