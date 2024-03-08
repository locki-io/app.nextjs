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

def create_centerpiece():
    
    bpy.ops.mesh.primitive_uv_sphere_add()
    obj = active_object()
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
