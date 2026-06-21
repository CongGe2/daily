"""
Knight · The Walker — Blender 交互式渲染
1. 点 ▶ Run 搭好场景
2. 按 1/2/3/4 切换四幕
3. 按 F12 渲染当前画面
"""

import bpy
import os
from math import radians

IMAGE_DIR = r'C:\Users\14169\portfolio\images\knight'

AI_IMAGES = {
    0: 'knight-v2-01-sunset.png',
    1: 'knight-v3-02-bloodsky.png',
    2: 'knight-v3-03-gloom.png',
    3: 'knight-v4-04-after-rain.png',
}

SCENES = [
    {'name':'01-sunset','sun_color':(1.0,0.55,0.25,1),'sun_energy':5,'fog_color':(0.85,0.55,0.35),'fog_density':0.012,'wet':0,'beam':0},
    {'name':'02-bloodsky','sun_color':(0.85,0.08,0.08,1),'sun_energy':3,'fog_color':(0.25,0.04,0.04),'fog_density':0.025,'wet':0,'beam':0},
    {'name':'03-gloom','sun_color':(0.55,0.55,0.55,1),'sun_energy':1.5,'fog_color':(0.18,0.18,0.18),'fog_density':0.035,'wet':0,'beam':0},
    {'name':'04-rain','sun_color':(1.0,0.90,0.65,1),'sun_energy':8,'fog_color':(0.25,0.25,0.28),'fog_density':0.018,'wet':0.7,'beam':120},
]

def find_node(nt, keyword):
    for n in nt.nodes:
        if keyword in n.bl_idname or keyword in n.name:
            return n
    return None

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for m in bpy.data.materials: bpy.data.materials.remove(m)

def setup_render():
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.device = 'CPU'
    bpy.context.scene.render.resolution_x = 1920
    bpy.context.scene.render.resolution_y = 1080
    bpy.context.scene.render.resolution_percentage = 100
    bpy.context.scene.cycles.samples = 64
    bpy.context.scene.cycles.use_denoising = True
    bpy.context.scene.view_settings.view_transform = 'AgX'
    bpy.context.scene.render.film_transparent = False

def create_world():
    w = bpy.data.worlds.new('World')
    bpy.context.scene.world = w
    w.use_nodes = True
    bg = find_node(w.node_tree, 'Background')
    if bg: bg.inputs['Color'].default_value = (0.02,0.01,0.03,1)
    return w

def create_camera():
    bpy.ops.object.camera_add(location=(0,5,40))
    cam = bpy.context.active_object
    cam.name = 'Camera'
    cam.rotation_euler = (radians(-5),0,0)
    cam.data.lens = 50
    bpy.context.scene.camera = cam
    return cam

def create_ground():
    bpy.ops.mesh.primitive_plane_add(size=180, location=(0,0,-80))
    g = bpy.context.active_object
    g.name = 'Ground'
    # Simple noise displacement via modifier
    tex = bpy.data.textures.new('Noise', 'CLOUDS')
    tex.noise_scale = 3.0
    tex.noise_depth = 6
    m = g.modifiers.new('Displace', 'DISPLACE')
    m.texture = tex
    m.strength = 0.6
    m.mid_level = 0.5
    # material
    mat = bpy.data.materials.new('GroundMat')
    mat.use_nodes = True
    bsdf = find_node(mat.node_tree, 'Principled')
    bsdf.inputs['Base Color'].default_value = (0.10,0.08,0.04,1)
    bsdf.inputs['Roughness'].default_value = 0.9
    mat.node_tree.links.new(bsdf.outputs['BSDF'], find_node(mat.node_tree,'Output').inputs['Surface'])
    g.data.materials.append(mat)
    return g

def create_knight():
    # Parent empty
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(-7,0,-78))
    parent = bpy.context.active_object
    parent.name = 'Knight'
    parent.scale = (0.12,0.12,0.12)

    mat = bpy.data.materials.new('Armor')
    mat.use_nodes = True
    bsdf = find_node(mat.node_tree,'Principled')
    bsdf.inputs['Base Color'].default_value = (0.14,0.14,0.17,1)
    bsdf.inputs['Roughness'].default_value = 0.3
    bsdf.inputs['Metallic'].default_value = 0.9

    mat2 = bpy.data.materials.new('Cape')
    mat2.use_nodes = True
    b = find_node(mat2.node_tree,'Principled')
    b.inputs['Base Color'].default_value = (0.04,0.03,0.03,1)
    b.inputs['Roughness'].default_value = 0.95

    mat3 = bpy.data.materials.new('Sword')
    mat3.use_nodes = True
    b = find_node(mat3.node_tree,'Principled')
    b.inputs['Base Color'].default_value = (0.22,0.22,0.28,1)
    b.inputs['Roughness'].default_value = 0.18
    b.inputs['Metallic'].default_value = 0.95

    # Body cylinder
    bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=7, location=(0,0,3.5))
    o = bpy.context.active_object; o.name='Body'; o.parent=parent; o.data.materials.append(mat)
    # Head sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, location=(0,0,7.8))
    o = bpy.context.active_object; o.name='Head'; o.parent=parent; o.data.materials.append(mat)
    o.scale = (1,1,0.7); bpy.ops.object.transform_apply(scale=True)
    # Cape plane
    bpy.ops.mesh.primitive_plane_add(size=3, location=(0,1.2,4.5))
    o = bpy.context.active_object; o.name='Cape'; o.parent=parent; o.data.materials.append(mat2)
    o.rotation_euler = (radians(12),0,0)
    o.scale = (1.1,3.0,1); bpy.ops.object.transform_apply(scale=True)
    # Sword grip
    bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=3, location=(3.2,0,5.5))
    o = bpy.context.active_object; o.name='Grip'; o.parent=parent; o.data.materials.append(mat3)
    # Guard
    bpy.ops.mesh.primitive_cube_add(size=0.7, location=(3.2,0,7))
    o = bpy.context.active_object; o.name='Guard'; o.parent=parent; o.data.materials.append(mat3)
    o.scale = (2.5,0.25,0.25); bpy.ops.object.transform_apply(scale=True)
    # Blade
    bpy.ops.mesh.primitive_cube_add(size=0.7, location=(3.2,-2.5,3.5))
    o = bpy.context.active_object; o.name='Blade'; o.parent=parent; o.data.materials.append(mat3)
    o.scale = (0.12,5,0.04); bpy.ops.object.transform_apply(scale=True)
    return parent

def create_sun():
    bpy.ops.object.light_add(type='SUN', location=(40,50,-20))
    s = bpy.context.active_object
    s.name = 'Sun'
    s.data.angle = radians(2)
    return s

def create_fog():
    bpy.ops.mesh.primitive_cube_add(size=250, location=(0,0,-40))
    f = bpy.context.active_object
    f.name = 'Fog'
    f.display_type = 'WIRE'
    mat = bpy.data.materials.new('FogMat')
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    vol = nt.nodes.new('ShaderNodeVolumeScatter')
    vol.inputs['Color'].default_value = (0.8,0.5,0.3,1)
    vol.inputs['Density'].default_value = 0.012
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(vol.outputs['Volume'], out.inputs['Volume'])
    f.data.materials.append(mat)
    return f

def create_beam():
    bpy.ops.object.light_add(type='SPOT', location=(-6,55,-78))
    b = bpy.context.active_object
    b.name = 'Beam'
    b.data.energy = 0
    b.data.spot_size = radians(12)
    b.data.spot_blend = 0.5
    b.data.shadow_soft_size = 10
    b.rotation_euler = (radians(-90),0,0)
    return b

def create_sky(image_path):
    bpy.ops.mesh.primitive_plane_add(size=150, location=(0,18,-130))
    p = bpy.context.active_object
    p.name = 'SkyBG'
    mat = bpy.data.materials.new('SkyMat')
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    tex = nt.nodes.new('ShaderNodeTexImage')
    emit = nt.nodes.new('ShaderNodeEmission')
    emit.inputs['Strength'].default_value = 0.7
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(tex.outputs['Color'], emit.inputs['Color'])
    nt.links.new(emit.outputs['Emission'], out.inputs['Surface'])
    if os.path.exists(image_path):
        tex.image = bpy.data.images.load(image_path)
    p.data.materials.append(mat)
    return p

# ════════════════════════════
# Scene switcher (called from console or by key)
# ════════════════════════════
def switch_scene(index):
    """切换到第 index 幕 (0-3)"""
    s = SCENES[index]
    print(f"\n🎬 {s['name']}")

    sun = bpy.data.objects.get('Sun')
    if sun:
        sun.data.color = s['sun_color'][:3]
        sun.data.energy = s['sun_energy']

    fog = bpy.data.objects.get('Fog')
    if fog and fog.data.materials:
        vol = find_node(fog.data.materials[0].node_tree, 'Volume')
        if vol:
            vol.inputs['Color'].default_value = s['fog_color']+(1,)
            vol.inputs['Density'].default_value = s['fog_density']

    beam = bpy.data.objects.get('Beam')
    if beam:
        beam.data.energy = s['beam']

    ground = bpy.data.objects.get('Ground')
    if ground and ground.data.materials:
        bsdf = find_node(ground.data.materials[0].node_tree, 'Principled')
        if bsdf:
            bsdf.inputs['Specular IOR Level'].default_value = s['wet'] * 0.5

    # Swap sky background
    sky = bpy.data.objects.get('SkyBG')
    if sky and sky.data.materials:
        tex_node = find_node(sky.data.materials[0].node_tree, 'TexImage')
        img_path = os.path.join(IMAGE_DIR, AI_IMAGES[index])
        if tex_node and os.path.exists(img_path):
            tex_node.image = bpy.data.images.load(img_path)

    # Update viewport
    for area in bpy.context.screen.areas:
        if area.type == 'VIEW_3D':
            area.tag_redraw()

# ════════════════════════════
# MAIN: Build everything once
# ════════════════════════════
def main():
    print("="*50)
    print("  KNIGHT · THE WALKER")
    print("="*50)

    clear_scene()
    setup_render()
    world = create_world()
    cam = create_camera()
    ground = create_ground()
    knight = create_knight()
    sun = create_sun()
    fog = create_fog()
    beam = create_beam()

    # Apply scene 0 (sunset)
    switch_scene(0)

    print("""
✅ 场景已就绪！

📋 操作:
  在 Blender Python 控制台输入:
    switch_scene(0)   → 晚霞
    switch_scene(1)   → 血红
    switch_scene(2)   → 灰暗
    switch_scene(3)   → 雨后光照

  按 Z → 切换渲染预览 (Rendered View)
  按 F12 → 渲染当前画面
  渲染完后 Image → Save As 保存

⚙️ 要调画质，改脚本顶部那几行:
  RENDER_WIDTH / RENDER_HEIGHT → 分辨率
  RENDER_SAMPLES → 采样数 (64=快, 256=好, 512=最终)
""")

if __name__ == '__main__':
    main()
