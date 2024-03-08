export const nftDataTemplate = `
import base64
import random
import time
import math
import mathutils
import bpy

################################################################
# helper functions BEGIN
################################################################

def purge_orphans():
    #Remove all orphan data blocks

    if bpy.app.version >= (3, 0, 0):
        # run this only for Blender versions 3.0 and higher
        bpy.ops.outliner.orphans_purge(do_local_ids=True, do_linked_ids=True, do_recursive=True)
    else:
        # run this only for Blender versions lower than 3.0
        # call purge_orphans() recursively until there are no more orphan data blocks to purge
        result = bpy.ops.outliner.orphans_purge()
        if result.pop() != "CANCELLED":
            purge_orphans()

def create_camera():
    cam_data = bpy.data.cameras.new('camera')
    cam = bpy.data.objects.new('camera', cam_data)
    bpy.context.collection.objects.link(cam)
    cam.location=(7.35,-6.92,5)
    # Get direction vector from camera location to origin
    direction = mathutils.Vector((0, 0, 0)) - cam.location
    # Calculate rotation quaternion to align camera with direction vector
    rot_quat = direction.to_track_quat('-Z', 'Y')
    cam.rotation_euler = rot_quat.to_euler()
    
def create_light():
    light_datas = bpy.data.lights.new('light', type= 'POINT')
    light = bpy.data.objects.new('light', light_datas)
    bpy.context.collection.objects.link(light)
    light.location=(4,1,6)
    light.data.energy=200.0

def clean_scene():

    # Removing all of the objects, collection, materials, particles,
    # textures, images, curves, meshes, actions, nodes, and worlds from the scene
    # make sure the active object is not in Edit Mode
    if bpy.context.active_object and bpy.context.active_object.mode == "EDIT":
        bpy.ops.object.editmode_toggle()

    # make sure non of the objects are hidden from the viewport, selection, or disabled
    for obj in bpy.data.objects:
        obj.hide_set(False)
        obj.hide_select = False
        obj.hide_viewport = False

    # select all the object and delete them (just like pressing A + X + D in the viewport)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()

    # find all the collections and remove them
    collection_names = [col.name for col in bpy.data.collections]
    for name in collection_names:
        bpy.data.collections.remove(bpy.data.collections[name])

    # in the case when you modify the world shader
    # delete and recreate the world object
    world_names = [world.name for world in bpy.data.worlds]
    for name in world_names:
        bpy.data.worlds.remove(bpy.data.worlds[name])
    # create a new world data block
    bpy.ops.world.new()
    bpy.context.scene.world = bpy.data.worlds["World"]

    purge_orphans()


def active_object():

    # returns the currently active object
    return bpy.context.active_object


def time_seed():
    
    # Sets the random seed based on the time
    # and copies the seed into the clipboard
    
    seed = time.time()
    print(f"seed: {seed}")
    random.seed(seed)

    # add the seed value to your clipboard
    bpy.context.window_manager.clipboard = str(seed)

    return seed


def set_fcurve_extrapolation_to_linear():
    for fc in bpy.context.active_object.animation_data.action.fcurves:
        fc.extrapolation = "LINEAR"


def create_data_animation_loop(obj, data_path, start_value, end_value, start_frame, loop_length, linear_extrapolation=True):

    #To make a data property loop we need to:
    # 1. set the property to an initial value and add a keyframe in the beginning of the loop
    # 2. set the property to a middle value and add a keyframe in the middle of the loop
    # 3. set the property the initial value and add a keyframe at the end of the loop
    
    # set the start value
    setattr(obj, data_path, start_value)
    # add a keyframe at the start
    obj.keyframe_insert(data_path, frame=start_frame)
    # Set interpolation mode to linear for start keyframe
    obj.animation_data.action.fcurves.find(data_path).keyframe_points[-1].interpolation = 'LINEAR'
 
    # set the middle value
    #setattr(obj, data_path, mid_value)
    # add a keyframe in the middle
    #mid_frame = start_frame + (loop_length) / 2
    #obj.keyframe_insert(data_path, frame=mid_frame) 

    # set the end value
    setattr(obj, data_path, end_value) 
    # add a keyframe in the end
    end_frame = start_frame + loop_length
    obj.keyframe_insert(data_path, frame=end_frame)
    
    # Set interpolation mode to linear for end keyframe
    obj.animation_data.action.fcurves.find(data_path).keyframe_points[-1].interpolation = 'LINEAR'


    if linear_extrapolation:
        set_fcurve_extrapolation_to_linear()


def set_scene_props(fps, frame_count):

    # Set scene properties
  
    scene = bpy.context.scene
    scene.frame_end = frame_count

    # set the world background to black
    world = bpy.data.worlds["World"]
    if "Background" in world.node_tree.nodes:
        world.node_tree.nodes["Background"].inputs[0].default_value = (0, 0, 0, 1)

    scene.render.fps = fps

    scene.frame_current = 1
    scene.frame_start = 1


def scene_setup():
    fps = 30
    loop_seconds = 12
    frame_count = fps * loop_seconds

    seed = 0
    if seed:
        random.seed(seed)
    else:
        time_seed()

    clean_scene()

    set_scene_props(fps, frame_count)

def import_b64_img_astexture(b64img):
    if len(b64img) > 0:
        data = base64.b64decode(b64img)
        filename = 'material.png'
        filepath = os.path.join(bpy.app.tempdir,filename)
        
        with open(filepath,'wb') as f:
            f.write(data)
        
        bpy.ops.image.open(filepath=filepath, directory=bpy.app.tempdir)
        return filepath

################################################################
# helper functions END
################################################################


def link_nodes_by_mesh_socket(node_tree, from_node, to_node):
    node_tree.links.new(from_node.outputs["Mesh"], to_node.inputs["Mesh"])


def create_node(node_tree, type_name, node_x_location, node_location_step_x=0):
    # Creates a node of a given type, and sets/updates the location of the node on the X axis.
    # Returning the node object and the next location on the X axis for the next node.
    
    node_obj = node_tree.nodes.new(type=type_name)
    node_obj.location.x = node_x_location
    node_x_location += node_location_step_x

    return node_obj, node_x_location

def update_shader_node_tree(mat):

    shader = mat.node_tree
    #start with a clean node tree
    for node in shader.nodes:
        shader.nodes.remove(node)
    #shader interface
    
    #initialize shader nodes
    #node Principled BSDF
    principled_bsdf = shader.nodes.new("ShaderNodeBsdfPrincipled")
    principled_bsdf.name = "Principled BSDF"
    principled_bsdf.distribution = 'MULTI_GGX'
    principled_bsdf.subsurface_method = 'RANDOM_WALK'
    #Metallic
    principled_bsdf.inputs[1].default_value = 0.0
    #Roughness
    principled_bsdf.inputs[2].default_value = 0.5314960479736328
    #IOR
    principled_bsdf.inputs[3].default_value = 1.4500000476837158
    #Alpha
    principled_bsdf.inputs[4].default_value = 1.0
    #Normal
    principled_bsdf.inputs[5].default_value = (0.0, 0.0, 0.0)
    #Weight
    principled_bsdf.inputs[6].default_value = 0.0
    #Subsurface Weight
    principled_bsdf.inputs[7].default_value = 0.0
    #Subsurface Radius
    principled_bsdf.inputs[8].default_value = (1.0, 0.20000000298023224, 0.10000000149011612)
    #Subsurface Scale
    principled_bsdf.inputs[9].default_value = 0.05000000074505806
    #Subsurface IOR
    principled_bsdf.inputs[10].default_value = 1.399999976158142
    #Subsurface Anisotropy
    principled_bsdf.inputs[11].default_value = 0.0
    #Specular IOR Level
    principled_bsdf.inputs[12].default_value = 0.5
    #Specular Tint
    principled_bsdf.inputs[13].default_value = (1.0, 1.0, 1.0, 1.0)
    #Anisotropic
    principled_bsdf.inputs[14].default_value = 0.0
    #Anisotropic Rotation
    principled_bsdf.inputs[15].default_value = 0.0
    #Tangent
    principled_bsdf.inputs[16].default_value = (0.0, 0.0, 0.0)
    #Transmission Weight
    principled_bsdf.inputs[17].default_value = 0.0
    #Coat Weight
    principled_bsdf.inputs[18].default_value = 0.0
    #Coat Roughness
    principled_bsdf.inputs[19].default_value = 0.029999999329447746
    #Coat IOR
    principled_bsdf.inputs[20].default_value = 1.5
    #Coat Tint
    principled_bsdf.inputs[21].default_value = (1.0, 1.0, 1.0, 1.0)
    #Coat Normal
    principled_bsdf.inputs[22].default_value = (0.0, 0.0, 0.0)
    #Sheen Weight
    principled_bsdf.inputs[23].default_value = 0.0
    #Sheen Roughness
    principled_bsdf.inputs[24].default_value = 0.5
    #Sheen Tint
    principled_bsdf.inputs[25].default_value = (1.0, 1.0, 1.0, 1.0)
    #Emission Color
    principled_bsdf.inputs[26].default_value = (1.0, 1.0, 1.0, 1.0)
    #Emission Strength
    principled_bsdf.inputs[27].default_value = 0.0
    
    #node Material Output
    material_output = shader.nodes.new("ShaderNodeOutputMaterial")
    material_output.name = "Material Output"
    material_output.is_active_output = True
    material_output.target = 'ALL'
    #Displacement
    material_output.inputs[2].default_value = (0.0, 0.0, 0.0)
    #Thickness
    material_output.inputs[3].default_value = 0.0
    
    
    
    return shader

def update_geo_node_tree(node_tree):
    
    #Adding a Cube Mesh, Subdiv, Triangulate, Edge Split, and Element scale geo node into the
    #geo node tree

    #Geo Node type names found here
    #https://docs.blender.org/api/current/bpy.types.GeometryNode.html

    #or copy paste here the result of NodetoPython addon

    out_node = node_tree.nodes["Group Output"]


def create_centerpiece():
    
    bpy.ops.mesh.primitive_uv_sphere_add()
    obj = active_object()
    #geo node 
    bpy.ops.node.new_geometry_nodes_modifier()
    node_tree = bpy.data.node_groups["Geometry Nodes"]
    update_geo_node_tree(node_tree)
    #material 
    mat = bpy.data.materials.new(name='Material')
    mat.use_nodes=True
    obj = active_object()
    obj.data.materials.append(mat)
    update_shader_node_tree(mat)
    
    bpy.ops.object.modifier_add(type="SOLIDIFY")
    

def main():
    
    # Python code to generate an animated geo nodes node tree
    # that consists of a subdivided & triangulated cube with animated faces
    
    scene_setup()
    create_centerpiece()

    create_camera()
    create_light()
     
    obj = active_object()
    
    # Define start and end rotations
    start_value=math.radians(0), math.radians(0), math.radians(0)
    mid_value= math.radians(0), math.radians(10), math.radians(180)
    end_value= math.radians(0), math.radians(0), math.radians(359)
    start_frame = 1
    loop_length = 100
    create_data_animation_loop(obj, "rotation_euler", start_value, end_value, start_frame, loop_length, linear_extrapolation=True)
    bpy.context.scene.frame_end = loop_length 
    
    

if __name__ == "__main__":
    main()  
`;
