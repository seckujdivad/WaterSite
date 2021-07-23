import {vec3} from "gl-matrix";

import IMaterial from "../IMaterial";
import MaterialIdentifier from "../MaterialIdentifier";
import Texture from "../../texture/Texture";
import DefaultRenderer from "./DefaultRenderer";


class DefaultMaterial implements IMaterial
{
	colour: Texture;
	normal: Texture;

	constructor(colour: Texture = vec3.create(), normal: Texture = vec3.fromValues(0.5, 0.5, 0.5))
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