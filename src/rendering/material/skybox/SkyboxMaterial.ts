import {vec3} from "gl-matrix";

import IMaterial from "../IMaterial";
import MaterialIdentifier from "../MaterialIdentifier";
import Texture, {TextureType} from "../../texture/Texture";
import SkyboxRenderer from "./SkyboxRenderer";

class SkyboxMaterial implements IMaterial
{
	skybox_cubemap: Texture;

	constructor(skybox_cubemap: Texture = {type: TextureType.TextureCubemap, data: vec3.fromValues(0, 0, 0)})
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