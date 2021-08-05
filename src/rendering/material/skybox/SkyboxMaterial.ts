import {vec3} from "gl-matrix";

import IMaterial from "../IMaterial";
import MaterialIdentifier from "../MaterialIdentifier";
import {TextureCubemap, createTextureCubemap} from "../../texture/Texture";
import SkyboxRenderer from "./SkyboxRenderer";

class SkyboxMaterial implements IMaterial
{
	skybox_cubemap: TextureCubemap;

	constructor(skybox_cubemap = createTextureCubemap(vec3.fromValues(0, 0, 0)))
	{
		this.skybox_cubemap = skybox_cubemap;
	}

	generateRenderer(context: WebGL2RenderingContextStrict)
	{
		return new SkyboxRenderer(context);
	}

	getMaterialIdentifier()
	{
		return skyboxMaterialIdentifier;
	}
}

const skyboxMaterialIdentifier = new MaterialIdentifier();

export default SkyboxMaterial;