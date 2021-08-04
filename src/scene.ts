import {vec3} from "gl-matrix";

import Model from "./rendering/model/Model";
import {loadPLYModelFromURL} from "./rendering/model/PlyLoader";
import Camera from "./rendering/Camera";
import IMaterial from "./rendering/material/IMaterial";
import DefaultMaterial from "./rendering/material/default/DefaultMaterial";
import SkyboxMaterial from "./rendering/material/skybox/SkyboxMaterial";
import {TextureType} from "./rendering/texture/Texture";
import ModelPresets, {modelFromPreset} from "./rendering/model/ModelPresets";


function getCamera()
{
	return new Camera(vec3.fromValues(0, 0, 3), vec3.create(), Math.PI / 4);
}

function getModels(modelLoadedCallback?: (modelLoaded: Model<IMaterial>) => void)
{
	let cube = new Model(new DefaultMaterial());
	cube.material.colour = {type: TextureType.Texture2D, data: "./seamless_desert_sand_texture_by_hhh316_d311qn7-fullview.jpg"};
	cube.material.normal = {type: TextureType.Texture2D, data: "./SeaWavesB_N.jpg"};
	loadPLYModelFromURL(cube, "./cube.ply").then(modelLoadedCallback);

	let skybox = new Model(new SkyboxMaterial({type: TextureType.TextureCubemap, data: "./seamless_desert_sand_texture_by_hhh316_d311qn7-fullview.jpg"})); //./Daylight_Box_UV.png
	modelFromPreset(skybox, ModelPresets.FlatPlane);

	return [cube, skybox];
}

export {getCamera, getModels};