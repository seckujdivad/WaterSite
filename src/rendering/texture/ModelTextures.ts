import {vec3} from "gl-matrix";

import Texture from "./Texture";


class ModelTextures
{
	colour: Texture;
	normal: Texture;

	constructor(colour: Texture = vec3.create(), normal: Texture = vec3.fromValues(0.5, 0.5, 0.5))
	{
		this.colour = colour;
		this.normal = normal;
	}
}

export default ModelTextures;