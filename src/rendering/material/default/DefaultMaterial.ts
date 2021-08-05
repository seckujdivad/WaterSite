import {vec3} from "gl-matrix";

import IMaterial from "../IMaterial";
import MaterialIdentifier from "../MaterialIdentifier";
import {Texture2D, TextureCubemap, createTexture2D, createTextureCubemap} from "../../texture/Texture";
import DefaultRenderer from "./DefaultRenderer";


class DefaultMaterial implements IMaterial
{
	colour: Texture2D;
	normal: Texture2D;

	skybox: TextureCubemap;

	constructor(colour = createTexture2D(vec3.create()),
		normal = createTexture2D(vec3.fromValues(0.5, 0.5, 0.5)),
		skybox = createTextureCubemap(vec3.create()))
	{
		this.colour = colour;
		this.normal = normal;
		this.skybox = skybox;
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