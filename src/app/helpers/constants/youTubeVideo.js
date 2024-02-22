export const youTubeVideo = 
`
<url>
<loc>https://youtu.be/ct23jjwGiZY</loc>
<desc>Watch the Tutorial:</desc>
<content>
  <file>
    <url>
    https://ryankingart.gumroad.com/l/Disintegrate?layout=discover&recommended_by=search&_gl=1*708wuk*_ga*OTkxMjUwOTM5LjE3MDczOTY4Njc.*_ga_6LJN6D94N6*MTcwODU5MDUxNi43LjEuMTcwODU5MDc3Ni4wLjAuMA..
    </url>
    <desc>
    Free download of my Disintegrate Objects geometry nodes setup.
    Use this Geometry Nodes Modifier Setup to make objects Disintegrate.
    Add this geometry nodes modifier setup to any mesh object, and then animate the dissolve mesh mesh value to make the mesh disintegrate. You can also control the detail level and random seed with the modifier.
    This product is completely free, but if you'd like to add a few dollars into the price box before purchasing to send me a tip, I'd greatly appreciate it! Thanks! 🙂
    Contents:
    ● Geometry Nodes Animation File
    ● Geometry Nodes Blender File
    ● Final Animation Video
    ● HDRI Lighting
    ● Sci-Fi Background Image
    </desc>
    <price>0</price>
  </file>
</content>
</url>

<url>
<loc>https://www.youtube.com/watch?v=Hnm97p31R_k&list=PLsGl9GczcgBsv58A4sTYSmLDhipykRS4O&index=1</loc>
<desc>Rock Generator - Geometry Nodes (Blender Tutorial)</desc>
<content>
  <file>
    <url>
    https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa3BrT21BSU14MHAzaEhaYXpQTUNTQ1ZvWFdGd3xBQ3Jtc0tueEMyeGF2RUMyRGgydk50XzIzdFdDdmdsUFlXTnFKMkllZ3pkNkNaanU3VDFIcEt2UVE4ZUFMS3lXRW9oMnRZQlo3YmU2b21VMkxLNV9tVTJEQVZoTnVaY00ySGdOc0gwS2RKd3hYYXVrbzYzcmJwZw&q=https%3A%2F%2Fryankingart.gumroad.com%2Fl%2Frock-generator&v=Hnm97p31R_k
    </url>
    <desc>
    Customizable Geometry Nodes:
    The Geometry Nodes Modifier setup has many customizable values to control the look of the rock, like the rock sub-surf, random shape, edge size, edge crease, smoothness, details, noise, roughness, and more!

    Generating Rocks:
    To generate lots of different rocks, just duplicate the rock object, and then change any of the geometry node modifier values. You can also go into edit mode, and edit the geometry, to change the size and shape of the rock.

    Rock Materials:
    The product comes with a base Procedural Rock Material applied to the rock object. Inside the Blender file are also 10 Procedural Rock Materials, and 5 Other Rock Materials created with Textures. Or you can apply your own rock materials to the rock.

    Contents:

    ● Procedural Rock Generator Blender File
    ● 10 Procedural Rock Materials (Inside Blender File)
    ● 5 Rock Materials Using Textures (Inside Blender File)
    ● Rock Color, Roughness, and Normal Texture Maps
    ● HDRI Lighting
    </desc>
    <price>12</price>
  </file>
</content>
</url>
<url>
<loc>https://www.youtube.com/watch?v=nmJqIaSZlRs&list=PLB8-FQgROBmmeCnCfuJEGzP0nH0u3tz7j</loc>
<desc>Beginner Python Exercise in Blender: Simple cube location animation</desc>
<content>
  <file>
    <url>
    https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa3JUaGo3Ynhqdlhud254ZXNHR1E0dWpnZWYwd3xBQ3Jtc0tra0tZNThOWWJPbEV4akptNmFXU3FPbXEyMU5wQkVTMmRsZFJjMnZubXdPSzBQVHNUSEw5dDRxNVlzQllIeXRrZGo0ajFtUXdjSXNDSHhndzFSZE1hSXhUdFlRcjlOaTh0a0xiQ3N1R2xoVGZoZzBuNA&q=https%3A%2F%2Fgist.github.com%2FCGArtPython%2F83a324c9938216c91df746c15179e992&v=nmJqIaSZlRs
    </url>
    <desc>
    This is a video exercise for Blender Python beginners.
    We will write a Python script that animates a Cube's location creating a loop.
    </desc>
    <pycode>
    # give Python access to Blender's functionality
    import bpy
    
    # add a cube into the scene
    bpy.ops.mesh.primitive_cube_add()
    # get a reference to the currently active object
    cube = bpy.context.active_object
    
    # insert keyframe at frame one
    start_frame = 1
    cube.keyframe_insert("location", frame=start_frame)
    
    # change the location of the cube on the z-axis
    cube.location.z = 5
    
    # insert keyframe at the last frame
    end_frame = 180
    cube.keyframe_insert("location", frame=end_frame)
    </pycode>
    <price>0</price>
  </file>
</content>
</url>
<url>
<loc>https://www.youtube.com/watch?v=N3U2noAHgBo</loc>
<desc>Creating a Mesh from Scratch with Python - Learn to create 3D meshes using Blender's bmesh Python module in this tutorial! Master getting references to vertices, edges, and faces and learn about Python's list comprehension feature. This will be a fast-paced, step-by-step guide for taking your Blender Python skills to the next level. #Blender3D #Bmesh #python 
</desc>
<content>
  <file>
    <url>
    https://gist.github.com/CGArtPython/5b230013a62c1a2083e66fc7932ef8b6
    </url>
    <desc>
    Creating a pyramid from scratch using the Bmesh Blender Python module. 
    </desc>
    <pycode>
    import bpy
    import bmesh

    obj_name = "my_shape"

    # create the mesh data
    mesh_data = bpy.data.meshes.new(f"{obj_name}_data")

    # create the mesh object using the mesh data
    mesh_obj = bpy.data.objects.new(obj_name, mesh_data)

    # add the mesh object into the scene
    bpy.context.scene.collection.objects.link(mesh_obj)

    # create a new bmesh
    bm = bmesh.new()

    # create a list of vertex coordinates
    vert_coords = [
        (1.0, 1.0, 0.0),
        (1.0, -1.0, 0.0),
        (-1.0, -1.0, 0.0),
        (-1.0, 1.0, 0.0),
        (0.0, 0.0, 1.0),
    ]

    # create and add a vertices
    for coord in vert_coords:
        bm.verts.new(coord)

    # create a list of vertex indices that are part of a given face
    face_vert_indices = [
        (0, 1, 2, 3),
        (4, 1, 0),
        (4, 2, 1),
        (4, 3, 2),
        (4, 0, 3),
    ]

    bm.verts.ensure_lookup_table()

    for vert_indices in face_vert_indices:
        bm.faces.new([bm.verts[index] for index in vert_indices])

    # writes the bmesh data into the mesh data
    bm.to_mesh(mesh_data)

    # [Optional] update the mesh data (helps with redrawing the mesh in the viewport)
    mesh_data.update()

    # clean up/free memory that was allocated for the bmesh
    bm.free()
    </pycode>
    <price>0</price>
  </file>
  <file>
    <url>
    https://gist.github.com/CGArtPython/43bf8e43cc0d44d7813ce1978dbbdcdd
    </url>
    <desc>
    Creating an icosphere using the Bmesh Blender Python module
    </desc>
    <pycode>
    import bpy
    import bmesh

    obj_name = "my_shape"

    # create the mesh data
    mesh_data = bpy.data.meshes.new(f"{obj_name}_data")

    # create the mesh object using the mesh data
    mesh_obj = bpy.data.objects.new(obj_name, mesh_data)

    # add the mesh object into the scene
    bpy.context.scene.collection.objects.link(mesh_obj)

    ####
    ####

    # create a new bmesh
    bm = bmesh.new()

    # create a icosphere
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=2.0)

    # writes the bmesh data into the mesh data
    bm.to_mesh(mesh_data)

    # [Optional] update the mesh data (helps with redrawing the mesh in the viewport)
    mesh_data.update()

    # clean up/free memory that was allocated for the bmesh
    bm.free()
    </pycode>
    <price>0</price>
  </file>
  <file>
    <url>
    https://gist.github.com/CGArtPython/61e208dfe0a1034c7dbb34824bbcce26
    </url>
    <desc>
    Get selected verts via list comprehension
    </desc>
    <pycode>
    import bpy
    import bmesh

    # get a reference to the active object
    mesh_obj = bpy.context.active_object

    # create a new bmesh
    bm = bmesh.from_edit_mesh(mesh_obj.data)

    selected_verts = [vert for vert in bm.verts if vert.select]

    print("selected vert")
    for vert in selected_verts:
        print(f"{vert.index}")

    # clean up/free memory that was allocated for the bmesh
    bm.free()
    </pycode>
    <price>0</price>
  </file>
</content>
</url>
///model
<url>
<loc></loc>
<desc></desc>
<content>
  <file>
    <url>

    </url>
    <desc>

    </desc>
    <pycode>

    </pycode>
    <price>0</price>
  </file>
</content>
</url>

`