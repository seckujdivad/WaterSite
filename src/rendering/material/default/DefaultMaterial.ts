import {vec3} from "gl-matrix";

import IMaterial from "../IMaterial";
import MaterialIdentifier from "../MaterialIdentifier";
import Texture, {TextureType} from "../../texture/Texture";
import DefaultRenderer from "./DefaultRenderer";


class DefaultMaterial implements IMaterial
{
	colour: Texture;
	normal: Texture;

	constructor(colour: Texture = {type: TextureType.Texture2D, data: vec3.create()}, normal: Texture = {type: TextureType.Texture2D, data: vec3.fromValues(0.5, 0.5, 0.5)})
	{
		this.colour = colour;
		this.normal = normal;
	}

	generateRenderer(context: WebGL2RenderingContextStrict)
	{
		return new DefaultRenderer(context);
	}

	getMaterialIdentifier()
	{
		return defaultMaterialIdentifier;
	}
};

const defaultMaterialIdentifier = new MaterialIdentifier();

export default DefaultMaterial;