import json, base64, re, sys, os, time
import urllib.request

API_URL = "https://nn.147ai.com/v1/chat/completions"
API_KEY = "sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7"
OUT_DIR = "images/optimized"

prompts = {
    "smartdorm-hero.jpg": """Product photography, three dorm storage products arranged on a white studio background, soft natural lighting from top-left, subtle shadows on a light wood surface:

Left: A wooden desk expansion board in folded position, light birch plywood with matte clear coat, visible stainless steel folding hinges on the sides, board thickness about 2cm, minimalist Scandinavian design. A coffee mug and notebook resting on it.

Center: Three stacking storage boxes in graduated sizes (S/M/L), frosted white PP plastic with transparent PET viewing windows showing folded clothes inside. Interlocking grooves on edges. Middle box in muted sage green. Rounded corners, modern minimalist.

Right: A bedside caddy rack, brushed aluminum frame with matte white ABS tray, two USB cable routing holes, phone stand slot with smartphone, circular cup indentation. Quick-release clamp visible.

All products same family. Studio lighting, 8K photorealistic, clean composition, warm neutral tones. PROFESSIONAL PRODUCT PHOTOGRAPHY.""",

    "smartdorm-room.jpg": """Interior photography, a real college dorm room in Macau, approximately 12 sqm, two-person room, warm afternoon sunlight streaming through a window on the left:

Classic bunk-bed-over-desk layout. On the desk, a wooden expansion board pulled forward, doubling desk depth from 60cm to 90cm. Laptop, notebook, and water bottle sit comfortably on the expanded surface with room to spare.

Beside the desk on floor, three stacking boxes (white and sage green) neatly stacked, transparent windows showing organized contents.

Attached to metal bed frame rail on right, a sleek bedside caddy holds a smartphone, USB cables through tidy holes, water bottle in cup holder.

Room feels lived-in but organized. Posters on wall, small plant, natural light. Cozy atmosphere, not staged. 35mm lens, warm color grading, PHOTOREALISTIC INTERIOR PHOTOGRAPHY.""",

    "smartdorm-expand.jpg": """Product detail shot, split composition showing a wooden desk expansion board in folded and extended states, on a clean dorm desk surface:

LEFT HALF: The board folded flat, only 6cm thick, leaning against wall behind desk, almost invisible. Laptop sits on main desk in front of it.

RIGHT HALF: The same board fully extended forward, adding about 30cm desk depth. Stainless steel folding hinges visible and sturdy. Coffee mug, notebook, and phone now fit in the new space.

Standard 120x60cm college dorm desk. Warm birch wood of expansion board matches desk tone. Natural window light, shallow depth of field on hinges. Product photography quality, clean and minimal. 8K. SQUARE FORMAT.""",

    "smartdorm-detail.jpg": """Product detail shot, split composition:

LEFT HALF: Three stacking boxes (S/M/L sizes) unstacked and arranged in a row. Transparent front windows showing contents - small box has stationery, medium has folded t-shirts, large has books. Interlocking grooves on edges visible. Middle box in sage green, others matte white. Soft shadow beneath each box.

RIGHT HALF: Bedside caddy rack attached to metal bed frame, close-up. Smartphone in dedicated slot, white USB cable threaded through routing hole, clear water bottle in cup holder. Aluminum frame with subtle brushed texture. Quick-release clamp gripping bed rail clearly visible.

White background, natural daylight, product catalog style, clean and minimal. Focus on functionality and material quality. 8K photorealistic. SQUARE FORMAT.""",
}

os.makedirs(OUT_DIR, exist_ok=True)

def generate(prompt, filename):
    print(f"\n[GEN] Generating {filename}...")

    # Call API
    payload = {
        "model": "gemini-3.1-flash-image-preview",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 8192
    }

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"[ERR] API error: {e}")
        return False

    # Extract base64 image from content
    content = data["choices"][0]["message"]["content"]

    # Find data URI pattern: ![image](data:image/...;base64,...)
    match = re.search(r'data:image/(png|jpeg);base64,([A-Za-z0-9+/=]+)', content)
    if not match:
        print(f"[ERR] No image found in response")
        print(f"Content preview: {content[:200]}...")
        return False

    img_format = match.group(1)
    img_data = base64.b64decode(match.group(2))

    # Save
    path = os.path.join(OUT_DIR, filename)
    with open(path, 'wb') as f:
        f.write(img_data)

    size_kb = len(img_data) / 1024
    print(f"[OK] {filename} saved ({size_kb:.0f}KB)")
    return True

# Generate all 4 images
success = 0
for filename, prompt in prompts.items():
    if os.path.exists(os.path.join(OUT_DIR, filename)):
        print(f"[SKIP] {filename} exists, skipping")
        success += 1
        continue

    if generate(prompt, filename):
        success += 1
    time.sleep(2)  # Rate limit buffer

print(f"\n{'='*50}")
print(f"Done: {success}/{len(prompts)} images generated")
print(f"Output: {OUT_DIR}/")
for f in prompts:
    path = os.path.join(OUT_DIR, f)
    if os.path.exists(path):
        print(f"  [OK] {f} ({os.path.getsize(path)/1024:.0f}KB)")
    else:
        print(f"  [MISS] {f}")
