import {vec3} from "gl-matrix";

import ModelPresets, {modelFromPreset} from "./rendering/model/ModelPresets";
import Model from "./rendering/model/Model";
import Camera from "./rendering/Camera";

function getCamera()
{
    return new Camera(vec3.fromValues(0, 0, 3), vec3.create());
}

function getModels()
{
    return [modelFromPreset(new Model(), ModelPresets.FlatPlane)];
}

export {getCamera, getModels};