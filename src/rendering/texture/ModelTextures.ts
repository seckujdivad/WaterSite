import {vec3} from "gl-matrix";

import Texture, {TextureType} from "./Texture";


class ModelTextures
{
	colour: Texture;
	normal: Texture;

	constructor(colour: Texture = new Texture(TextureType.Vec3, vec3.create()), normal: Texture = new Texture(TextureType.Vec3, vec3.fromValues(0.5, 0.5, 0.5)))
	{
		this.colour = colour;
		this.normal = normal;
	}
}

export default ModelTextures;