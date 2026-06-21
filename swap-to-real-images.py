"""Swap SmartDorm SVG placeholders with real rendered JPEGs"""
import os

JPEG_DIR = "images/optimized"
JPEGS = {
    "smartdorm-hero.jpg": False,
    "smartdorm-room.jpg": False,
    "smartdorm-expand.jpg": False,
    "smartdorm-detail.jpg": False,
}

# Check which JPEGs exist
for f in JPEGS:
    if os.path.exists(os.path.join(JPEG_DIR, f)):
        JPEGS[f] = True

ready = all(JPEGS.values())
print(f"JPEGs ready: {sum(JPEGS.values())}/{len(JPEGS)}")
for f, exists in JPEGS.items():
    print(f"  {'[OK]' if exists else '[MISS]'} {f}")

if not ready:
    print("\nNot all images ready yet. Run gen-images.py first.")
    exit(0)

with open('smartdorm.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Swap hero SVG -> JPEG
html = html.replace(
    'src="images/smartdorm-products.svg" alt="SmartDorm 三模块产品渲染图"',
    'src="images/optimized/smartdorm-hero.jpg" alt="SmartDorm 三模块产品渲染图"')
print("[1/4] Hero image swapped")

# Swap room scene SVG -> JPEG
html = html.replace(
    'src="images/smartdorm-room.svg" alt="SmartDorm 宿舍使用场景图"',
    'src="images/optimized/smartdorm-room.jpg" alt="SmartDorm 宿舍使用场景图"')
print("[2] Room scene swapped")

# Swap expand comparison
html = html.replace(
    'src="images/smartdorm-products.svg" alt="A模块',
    'src="images/optimized/smartdorm-expand.jpg" alt="A模块')
print("[3] Expand comparison swapped")

# Swap detail shot
html = html.replace(
    'src="images/smartdorm-room.svg" alt="B+C模块',
    'src="images/optimized/smartdorm-detail.jpg" alt="B+C模块')
print("[4] Detail shot swapped")

with open('smartdorm.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("\n[DONE] All SVG placeholders swapped with real rendered JPEGs")
