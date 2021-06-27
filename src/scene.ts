import {vec3} from "gl-matrix";

import Model from "./rendering/model/Model";
import {loadPLYModelFromURL} from "./rendering/model/PlyLoader";
import Camera from "./rendering/Camera";
import Texture, {TextureType} from "./rendering/texture/Texture";


function getCamera()
{
    return new Camera(vec3.fromValues(0, 0, 3), vec3.create());
}

function getModels()
{
    let cube = new Model();
    loadPLYModelFromURL(cube, "./cube.ply");
    cube.textures.colour = new Texture(TextureType.URL, "./seamless_desert_sand_texture_by_hhh316_d311qn7-fullview.jpg");
    cube.textures.normal = new Texture(TextureType.URL, "./SeaWavesB_N.jpg");

    return [
        cube
    ];
}

export {getCamera, getModels};