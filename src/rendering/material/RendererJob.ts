import Camera from "../Camera";
import Model from "../model/Model";
import GLModel from "../model/GLModel";
import TextureManager from "../texture/TextureManager";
import IMaterial from "./IMaterial";


class RendererJob<DerivedMaterial extends IMaterial>
{
	camera: Camera;
	models: Array<[Model<DerivedMaterial>, GLModel]>;

	texture_manager: TextureManager;

	constructor(camera: Camera, models: Array<[Model<DerivedMaterial>, GLModel]>, texture_manager: TextureManager)
	{
		this.camera = camera;
		this.models = models;
		this.texture_manager = texture_manager;
	}
};

export default RendererJob;