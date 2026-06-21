with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find project boundaries (comment markers)
markers = {}
for i, line in enumerate(lines):
    for key, marker in [
        ('rift', '<!-- Project 00 - Rift Speaker -->'),
        ('eclipse', '<!-- Project ★ - Eclipse Arena Game UI -->'),
        ('mindspace', '<!-- Project 0★ - MindSpace UX -->'),
        ('smartdorm', '<!-- Project TEAM - SmartDorm -->'),
        ('terrin', '<!-- Project 01 - Terrin -->'),
        ('vr', '<!-- Project 02 - VR Device -->'),
        ('bench', '<!-- Project 03 - Bench System -->'),
        ('ceramic', '<!-- Project 04 - Ceramic Art -->'),
        ('ringfit', '<!-- Project 05 - RingFit Dashboard -->'),
    ]:
        if marker in line:
            markers[key] = i

# Find project ends (next marker or section end)
keys_in_order = sorted(markers.items(), key=lambda x: x[1])
blocks = {}
for idx, (key, start) in enumerate(keys_in_order):
    end = keys_in_order[idx + 1][1] if idx + 1 < len(keys_in_order) else len(lines)
    blocks[key] = (start, end, lines[start:end])

print('Blocks extracted:', list(blocks.keys()))

# New order
order = ['rift', 'eclipse', 'mindspace', 'vr', 'smartdorm', 'terrin', 'bench', 'ceramic', 'ringfit']

# Rebuild file
new_lines = []
# Everything before the first project marker
first_marker = min(m[0] for m in blocks.values())
new_lines.extend(lines[:first_marker])

for key in order:
    start, end, block = blocks[key]
    new_lines.extend(block)

# Everything after the last project
last_end = max(m[1] for m in blocks.values())
new_lines.extend(lines[last_end:])

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Reordered: {order}')
print('Done')
