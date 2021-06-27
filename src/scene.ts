import {vec3} from "gl-matrix";

import Model from "./rendering/model/Model";
import ModelPresets, {modelFromPreset} from "./rendering/model/ModelPresets";
import {loadPLYModelFromURL} from "./rendering/model/PlyLoader";
import Camera from "./rendering/Camera";

function getCamera()
{
    return new Camera(vec3.fromValues(0, 0, 3), vec3.create());
}

function getModels()
{
    let cube = new Model();
    loadPLYModelFromURL(cube, "./cube.ply");

    return [
        cube
    ];
}

export {getCamera, getModels};