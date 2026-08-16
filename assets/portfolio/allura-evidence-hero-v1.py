from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import random

W, H = 1600, 900
OUT = Path(__file__).with_suffix('.png')
random.seed(50)

# A text-free, source-grounded editorial cover. No product UI, vendor marks,
# architecture labels, or technical claims are embedded in the raster asset.
base = Image.new('RGB', (W, H), '#071d35')
px = base.load()
for y in range(H):
    for x in range(W):
        # Restrained navy field: darker left edge, slightly brighter focus area.
        glow = max(0, 1 - (((x - 1120) / 900) ** 2 + ((y - 390) / 720) ** 2))
        px[x, y] = (7 + int(5 * glow), 29 + int(19 * glow), 53 + int(37 * glow))

# Soft depth plane.
soft = Image.new('RGBA', (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(soft)
sd.ellipse((740, -120, 1740, 820), fill=(0, 111, 220, 32))
sd.ellipse((-300, 430, 830, 1250), fill=(76, 155, 255, 20))
soft = soft.filter(ImageFilter.GaussianBlur(70))
base = Image.alpha_composite(base.convert('RGBA'), soft)

# Quiet ruled baseline: evidence path, not a system diagram.
line = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ld = ImageDraw.Draw(line)
for offset, alpha in [(0, 120), (18, 45), (36, 18)]:
    ld.line([(90, 642 + offset), (500, 642 + offset), (810, 520 + offset), (1280, 520 + offset), (1510, 426 + offset)], fill=(142, 202, 255, alpha), width=2)
    ld.ellipse((490, 632 + offset, 510, 652 + offset), fill=(225, 243, 255, alpha))
    ld.ellipse((800, 510 + offset, 820, 530 + offset), fill=(225, 243, 255, alpha))
    ld.ellipse((1270, 510 + offset, 1290, 530 + offset), fill=(225, 243, 255, alpha))
base = Image.alpha_composite(base, line.filter(ImageFilter.GaussianBlur(1)))

# Three restrained translucent material planes. These are visual structure only.
panel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
pd = ImageDraw.Draw(panel)
planes = [
    [(116, 170), (770, 118), (932, 303), (278, 355)],
    [(404, 385), (1058, 333), (1220, 518), (566, 570)],
    [(756, 598), (1410, 546), (1518, 673), (864, 725)],
]
for i, shape in enumerate(planes):
    pd.polygon(shape, fill=(244, 249, 255, 25 + i * 10), outline=(176, 216, 255, 105), width=2)
    # inset line establishes a repeatable border rhythm
    inset = [(x + (10 if j in (0, 3) else -10), y + (10 if j in (0, 1) else -10)) for j, (x, y) in enumerate(shape)]
    pd.line(inset + [inset[0]], fill=(116, 180, 242, 58), width=1)
base = Image.alpha_composite(base, panel)

# Sparse evidence points—bounded, deliberately not a node-link diagram.
points = Image.new('RGBA', (W, H), (0, 0, 0, 0))
qd = ImageDraw.Draw(points)
for _ in range(34):
    x = random.randint(180, 1450)
    y = random.randint(150, 720)
    r = random.choice([2, 2, 3, 4])
    qd.ellipse((x-r, y-r, x+r, y+r), fill=(188, 225, 255, random.randint(32, 92)))
points = points.filter(ImageFilter.GaussianBlur(.35))
base = Image.alpha_composite(base, points)

# Border and single approval-green accent—used once, not as a decorative palette.
finish = Image.new('RGBA', (W, H), (0, 0, 0, 0))
fd = ImageDraw.Draw(finish)
fd.rounded_rectangle((54, 54, W-54, H-54), radius=26, outline=(181, 217, 250, 70), width=1)
fd.line((1120, 756, 1425, 756), fill=(53, 209, 137, 190), width=4)
fd.ellipse((1415, 746, 1435, 766), fill=(126, 240, 184, 230))
base = Image.alpha_composite(base, finish)

base.convert('RGB').save(OUT, optimize=True, quality=94)
print(OUT)
