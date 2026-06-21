#!/usr/bin/env blender --python
"""
Knight · The Walker — Blender 4K 离线渲染
在 Blender 的 Scripting 工作区中打开并运行此脚本
Cycles 渲染器, 4 幕场景, 路径追踪, 体积光
"""

import bpy
import os
from math import radians, sin, cos, pi

# ══════════════════════════════════════════════
# 用户设置 — 改这些就行
# ══════════════════════════════════════════════
RENDER_WIDTH  = 1920   # 1080p 测试 (满意后改 3840)
RENDER_HEIGHT = 1080
RENDER_SAMPLES = 32     # 快速预览 (成品用 256-512)
RENDER_DEVICE = 'CPU'   # 先用 CPU 稳过
IMAGE_DIR = r'C:\Users\14169\portfolio\images\knight'

# AI 关键帧路径 (用作背景)
AI_IMAGES = {
    0: 'knight-v2-01-sunset.png',      # 晚霞
    1: 'knight-v3-02-bloodsky.png',    # 血红
    2: 'knight-v3-03-gloom.png',       # 灰暗
    3: 'knight-v4-04-after-rain.png',  # 雨后光照
}

# 场景参数
SCENES = [
    { # 0: 晚霞
        'name': '01-sunset',
        'sun_color': (1.0, 0.55, 0.25, 1.0),
        'sun_energy': 4.5,
        'sky_color': (0.08, 0.03, 0.05, 1.0),
        'fog_color': (0.85, 0.55, 0.35),
        'fog_density': 0.012,
        'ground_wet': 0.0,
        'beam_energy': 0,
    },
    { # 1: 血红
        'name': '02-bloodsky',
        'sun_color': (0.85, 0.08, 0.08, 1.0),
        'sun_energy': 3.0,
        'sky_color': (0.03, 0.01, 0.02, 1.0),
        'fog_color': (0.25, 0.04, 0.04),
        'fog_density': 0.025,
        'ground_wet': 0.0,
        'beam_energy': 0,
    },
    { # 2: 灰暗
        'name': '03-gloom',
        'sun_color': (0.55, 0.55, 0.55, 1.0),
        'sun_energy': 1.2,
        'sky_color': (0.02, 0.02, 0.02, 1.0),
        'fog_color': (0.18, 0.18, 0.18),
        'fog_density': 0.035,
        'ground_wet': 0.0,
        'beam_energy': 0,
    },
    { # 3: 雨后光照
        'name': '04-after-rain',
        'sun_color': (1.0, 0.90, 0.65, 1.0),
        'sun_energy': 7.0,
        'sky_color': (0.03, 0.03, 0.04, 1.0),
        'fog_color': (0.25, 0.25, 0.28),
        'fog_density': 0.018,
        'ground_wet': 0.7,
        'beam_energy': 120,
    },
]

# ══════════════════════════════════════════════
# 初始化
# ══════════════════════════════════════════════
def init_scene():
    """清除所有默认物体，设置渲染器"""
    # 清除
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for m in bpy.data.materials: bpy.data.materials.remove(m)
    for t in bpy.data.textures: bpy.data.textures.remove(t)

    # 渲染器
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.device = RENDER_DEVICE
    bpy.context.scene.render.resolution_x = RENDER_WIDTH
    bpy.context.scene.render.resolution_y = RENDER_HEIGHT
    bpy.context.scene.render.resolution_percentage = 100
    bpy.context.scene.render.film_transparent = False
    bpy.context.scene.cycles.samples = RENDER_SAMPLES
    bpy.context.scene.cycles.use_denoising = False   # 预览关降噪, 成品再开
    bpy.context.scene.view_settings.view_transform = 'AgX'
    # 'look' might differ per Blender version; use default if not found
    try:
        bpy.context.scene.view_settings.look = 'AgX - Very High Contrast'
    except:
        pass

    # 世界
    world = bpy.data.worlds.new('KnightWorld')
    bpy.context.scene.world = world
    world.use_nodes = True
    return world

# ══════════════════════════════════════════════
# 摄像机
# ══════════════════════════════════════════════
def create_camera():
    """摄像机: 低角度, 骑士在左侧黄金分割点"""
    bpy.ops.object.camera_add(location=(0, 4.5, 35))
    cam = bpy.context.active_object
    cam.name = 'MainCamera'
    cam.rotation_euler = (radians(-6), 0, 0)
    cam.data.lens = 50  # 接近人眼
    bpy.context.scene.camera = cam
    return cam

# ══════════════════════════════════════════════
# 地面
# ══════════════════════════════════════════════
def create_ground(wetness=0.0):
    """起伏草地平面, wetness 控制湿润反光程度"""
    # 草地用细分平面 + 噪波 displacement
    bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -80))
    ground = bpy.context.active_object
    ground.name = 'Ground'

    # 细分
    mod = ground.modifiers.new('Subdivide', 'SUBSURF')
    mod.levels = 2
    mod.render_levels = 3
    bpy.ops.object.modifier_apply(modifier='Subdivide')

    # 噪波 displacement
    tex = bpy.data.textures.new('GroundNoise', 'CLOUDS')
    tex.noise_scale = 2.5
    tex.noise_depth = 6
    mod = ground.modifiers.new('Displace', 'DISPLACE')
    mod.texture = tex
    mod.strength = 0.8
    mod.mid_level = 0.5
    bpy.ops.object.modifier_apply(modifier='Displace')

    # 材质 — 草地
    mat = bpy.data.materials.new('GroundMat')
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = (0.10, 0.08, 0.04, 1.0)  # 深色土
    bsdf.inputs['Roughness'].default_value = 0.9
    bsdf.inputs['Specular IOR Level'].default_value = wetness * 0.5  # 湿润反光

    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (200, 0)
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    ground.data.materials.append(mat)
    return ground

# ══════════════════════════════════════════════
# 骑士
# ══════════════════════════════════════════════
def create_knight():
    """骑士 3D 模型: 身体+头盔+披风+剑, 返回父级空物体"""
    # 父级
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(-6.0, 0, -78.5))
    knight = bpy.context.active_object
    knight.name = 'Knight'
    knight.scale = (0.15, 0.15, 0.15)

    # 盔甲材质
    armor_mat = bpy.data.materials.new('ArmorMat')
    armor_mat.use_nodes = True
    n = armor_mat.node_tree.nodes
    l = armor_mat.node_tree.links
    n.clear()
    bsdf = n.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0,0)
    bsdf.inputs['Base Color'].default_value = (0.15, 0.15, 0.18, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.35
    bsdf.inputs['Metallic'].default_value = 0.85
    out = n.new('ShaderNodeOutputMaterial')
    l.new(bsdf.outputs['BSDF'], out.inputs['Surface'])

    # 披风材质
    cape_mat = bpy.data.materials.new('CapeMat')
    cape_mat.use_nodes = True
    n = cape_mat.node_tree.nodes
    l = cape_mat.node_tree.links
    n.clear()
    bsdf = n.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.05, 0.04, 0.04, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.95
    bsdf.inputs['Metallic'].default_value = 0.0
    out = n.new('ShaderNodeOutputMaterial')
    l.new(bsdf.outputs['BSDF'], out.inputs['Surface'])

    # 剑材质
    sword_mat = bpy.data.materials.new('SwordMat')
    sword_mat.use_nodes = True
    n = sword_mat.node_tree.nodes
    l = sword_mat.node_tree.links
    n.clear()
    bsdf = n.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.25, 0.25, 0.3, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.2
    bsdf.inputs['Metallic'].default_value = 0.95
    out = n.new('ShaderNodeOutputMaterial')
    l.new(bsdf.outputs['BSDF'], out.inputs['Surface'])

    # === 身体 ===
    bpy.ops.mesh.primitive_cylinder_add(radius=1.2, depth=8, location=(0, 0, 4))
    body = bpy.context.active_object
    body.name = 'KnightBody'
    body.parent = knight
    body.data.materials.append(armor_mat)

    # === 头盔 ===
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1.1, location=(0, 0, 9))
    head = bpy.context.active_object
    head.name = 'KnightHead'
    head.parent = knight
    head.data.materials.append(armor_mat)
    # 压扁一点
    head.scale = (1, 1, 0.75)
    bpy.ops.object.transform_apply(scale=True)

    # === 披风 ===
    bpy.ops.mesh.primitive_plane_add(size=3, location=(0, 1.0, 5))
    cape = bpy.context.active_object
    cape.name = 'KnightCape'
    cape.parent = knight
    cape.data.materials.append(cape_mat)
    cape.rotation_euler = (radians(15), 0, 0)
    # 拉长成披风形状
    cape.scale = (1.2, 3.5, 1)
    bpy.ops.object.transform_apply(scale=True)
    # 披风下半部往后飘
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.subdivide(number_cuts=3)
    bpy.ops.object.mode_set(mode='OBJECT')
    # 波浪
    mod = cape.modifiers.new('Wave', 'SIMPLE_DEFORM')
    mod.deform_method = 'BEND'
    mod.angle = radians(12)
    bpy.ops.object.modifier_apply(modifier='Wave')

    # === 剑 ===
    # 剑柄
    bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=3, location=(3.5, 0, 6))
    grip = bpy.context.active_object
    grip.name = 'SwordGrip'
    grip.parent = knight
    grip.data.materials.append(sword_mat)
    # 护手
    bpy.ops.mesh.primitive_cube_add(size=0.8, location=(3.5, 0, 7.5))
    guard = bpy.context.active_object
    guard.name = 'SwordGuard'
    guard.parent = knight
    guard.data.materials.append(sword_mat)
    guard.scale = (2, 0.3, 0.3)
    bpy.ops.object.transform_apply(scale=True)
    # 剑刃 (拖到地面)
    bpy.ops.mesh.primitive_cube_add(size=0.8, location=(3.5, 0, 5.5))
    blade = bpy.context.active_object
    blade.name = 'SwordBlade'
    blade.parent = knight
    blade.data.materials.append(sword_mat)
    blade.scale = (0.15, 7, 0.05)
    bpy.ops.object.transform_apply(scale=True)
    # 剑尖拖地 — 往下偏移
    blade.location = (3.5, -3.0, 2)

    return knight

# ══════════════════════════════════════════════
# 天空背景 (AI 图作为发光平面)
# ══════════════════════════════════════════════
def create_sky_bg(image_path):
    """用 AI 关键帧做背景, 放在远处作为自发光平面"""
    bpy.ops.mesh.primitive_plane_add(size=140, location=(0, 15, -120))
    plane = bpy.context.active_object
    plane.name = 'SkyBG'
    # 垂直放置, 面向摄像机
    plane.rotation_euler = (0, 0, 0)

    # 加载图片
    mat = bpy.data.materials.new('SkyMat')
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    tex_node = nodes.new('ShaderNodeTexImage')
    tex_node.location = (-300, 0)
    if os.path.exists(image_path):
        img = bpy.data.images.load(image_path)
        tex_node.image = img

    emit = nodes.new('ShaderNodeEmission')
    emit.location = (0, 0)
    emit.inputs['Strength'].default_value = 0.8

    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (200, 0)
    links.new(tex_node.outputs['Color'], emit.inputs['Color'])
    links.new(emit.outputs['Emission'], output.inputs['Surface'])

    plane.data.materials.append(mat)
    return plane

# ══════════════════════════════════════════════
# 体积雾
# ══════════════════════════════════════════════
def create_volume(fog_color, fog_density):
    """覆盖整个场景的体积雾"""
    bpy.ops.mesh.primitive_cube_add(size=300, location=(0, 0, -40))
    fog = bpy.context.active_object
    fog.name = 'VolumeFog'

    mat = bpy.data.materials.new('FogMat')
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # 体积散射 (兼容不同 Blender 版本)
    try:
        volume = nodes.new('ShaderNodeVolumeScatter')
    except:
        volume = nodes.new('ShaderNodeVolumeScatter')
    volume.location = (0, 0)
    volume.inputs['Color'].default_value = fog_color + (1.0,)
    volume.inputs['Density'].default_value = fog_density

    # 物体顶部密度低, 底部高 (用渐变)
    tex_coord = nodes.new('ShaderNodeTexCoord')
    tex_coord.location = (-300, 100)
    grad = nodes.new('ShaderNodeValToRGB')
    grad.location = (-150, 100)
    grad.color_ramp.elements[0].position = 0.3
    grad.color_ramp.elements[1].position = 0.7
    links.new(tex_coord.outputs['Generated'], grad.inputs['Fac'])

    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (200, 0)
    links.new(volume.outputs['Volume'], output.inputs['Volume'])

    fog.data.materials.append(mat)
    return fog

# ══════════════════════════════════════════════
# 上帝光束
# ══════════════════════════════════════════════
def create_god_ray(location, energy):
    """用 Spot Light + 体积创建上帝光束"""
    bpy.ops.object.light_add(type='SPOT', location=location)
    light = bpy.context.active_object
    light.name = 'GodRay'
    light.data.energy = energy
    light.data.spot_size = radians(15)
    light.data.spot_blend = 0.5
    light.data.shadow_soft_size = 8
    light.rotation_euler = (radians(-90), 0, 0)
    return light

# ══════════════════════════════════════════════
# 主光源
# ══════════════════════════════════════════════
def create_sun(color, energy, location=(30, 40, -20)):
    """暖色方向光模拟太阳"""
    bpy.ops.object.light_add(type='SUN', location=location)
    sun = bpy.context.active_object
    sun.name = 'MainSun'
    sun.data.color = color[:3]
    sun.data.energy = energy
    sun.data.angle = radians(2.5)  # 软阴影
    return sun

# ══════════════════════════════════════════════
# 应用场景设置
# ══════════════════════════════════════════════
def find_node_by_type(node_tree, node_type):
    """按类型查找节点，兼容不同 Blender 版本"""
    for node in node_tree.nodes:
        if node_type in node.bl_idname or node_type in node.name:
            return node
    return None

def apply_scene(scene_data, world, sky_bg, fog_obj, sun_obj, god_ray):
    """更新场景参数到现有物体"""
    s = scene_data
    # 世界背景色
    bg = find_node_by_type(world.node_tree, 'Background')
    if bg:
        bg.inputs['Color'].default_value = s['sky_color']

    # 太阳
    if sun_obj and sun_obj.data:
        sun_obj.data.color = s['sun_color'][:3]
        sun_obj.data.energy = s['sun_energy']

    # 雾
    if fog_obj and fog_obj.data.materials:
        fog_mat = fog_obj.data.materials[0]
        vol_node = find_node_by_type(fog_mat.node_tree, 'Volume')
        if vol_node:
            vol_node.inputs['Color'].default_value = s['fog_color'] + (1.0,)
            vol_node.inputs['Density'].default_value = s['fog_density']

    # 光束
    if god_ray and god_ray.data:
        god_ray.data.energy = s['beam_energy']

    # 地面湿润度
    ground = bpy.data.objects.get('Ground')
    if ground and ground.data.materials:
        bsdf = find_node_by_type(ground.data.materials[0].node_tree, 'Principled')
        if bsdf:
            bsdf.inputs['Specular IOR Level'].default_value = s['ground_wet'] * 0.5

# ══════════════════════════════════════════════
# 渲染
# ══════════════════════════════════════════════
def render_scene(output_path):
    """渲染当前帧到文件"""
    bpy.context.scene.render.filepath = output_path
    bpy.context.scene.render.image_settings.file_format = 'PNG'
    bpy.ops.render.render(write_still=True)

# ══════════════════════════════════════════════
# 主流程
# ══════════════════════════════════════════════
def main():
    print("\n" + "="*60)
    print("  KNIGHT · THE WALKER — Blender 4K Render")
    print("="*60 + "\n")

    # 1. 初始化
    world = init_scene()
    cam = create_camera()
    ground = create_ground()
    knight = create_knight()

    # 2. 共享物体 (不随场景变)
    sun = create_sun((1, 0.55, 0.25, 1), 4.5)

    # 3. 逐场景渲染
    for i, scene_data in enumerate(SCENES):
        print(f"\n🎬 Scene {i+1}/4: {scene_data['name']}")

        # 天空背景
        img_path = os.path.join(IMAGE_DIR, AI_IMAGES[i])
        sky = create_sky_bg(img_path)

        # 体积雾
        fog = create_volume(scene_data['fog_color'], scene_data['fog_density'])

        # 光束
        god_ray = create_god_ray((-6, 60, -78), scene_data['beam_energy'])

        # 应用场景设置
        apply_scene(scene_data, world, sky, fog, sun, god_ray)

        # 渲染
        output = os.path.join(IMAGE_DIR, f'blender-{scene_data["name"]}.png')
        print(f"   🖼️  Rendering → {output}")
        render_scene(output)

        # 清理场景特有物体
        bpy.data.objects.remove(sky, do_unlink=True)
        bpy.data.objects.remove(fog, do_unlink=True)
        bpy.data.objects.remove(god_ray, do_unlink=True)
        bpy.data.materials.remove(bpy.data.materials['SkyMat'])
        bpy.data.materials.remove(bpy.data.materials['FogMat'])

    print("\n" + "="*60)
    print("  ✅ 全部 4 张 4K 渲染完成")
    print(f"  📁 {IMAGE_DIR}")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
