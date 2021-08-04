import WebGLDebugUtils from "webgl-debug";

import narrowCanvas from "./HTMLCanvasTypes";
import GLModel from "./model/GLModel";
import {IModel} from "./model/Model";
import Camera from "./Camera";
import TextureManager from "./texture/TextureManager";
import IMaterial from "./material/IMaterial";
import MaterialIdentifier from "./material/MaterialIdentifier";
import IRenderer from "./material/IRenderer";
import RendererJob from "./material/RendererJob";


function WebGLErrorCallback(error: number, function_name: string)
{
	throw WebGLDebugUtils.glEnumToString(error) + " was caused by a call to: " + function_name;
}

function forEachWebGLCall(function_name: string, args: Array<any>)
{
	for (const arg of args)
	{
		if (arg === undefined)
		{
			throw Error("undefined passed to " + function_name);
		}
	}
}

class Engine
{
	_context: WebGL2RenderingContextStrict;

	_renderers: Map<MaterialIdentifier, IRenderer<IMaterial>>;
	_texture_manager: TextureManager;

	_gl_models: Array<GLModel>;

	constructor(context: WebGL2RenderingContextStrict)
	{
		this._context = WebGLDebugUtils.makeDebugContext(context, WebGLErrorCallback, forEachWebGLCall);
		if (this._context === null)
		{
			alert("Can't get WebGL context");
		}

		this._texture_manager = new TextureManager(this._context);
		this._gl_models = [];
		this._renderers = new Map();

		const gl = this._context;
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.disable(gl.BLEND);
	}

	render(models: Array<IModel>, camera: Camera)
	{
		const gl = this._context;

		//set up viewport width
		const canvas = narrowCanvas(gl.canvas);
		gl.canvas.width = canvas.clientWidth;
		gl.canvas.height = canvas.clientHeight;
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		//create GL models
		// remove excess GLModels
		while (this._gl_models.length > models.length)
		{
			this._gl_models.pop();
		}

		// set vertices for existing GLModels
		for (let i = 0; i < this._gl_models.length; i++)
		{
			this._gl_models[i].setVertices(models[i].toArray());
		}

		// create more GLModels if required
		if (this._gl_models.length < models.length)
		{
			for (let i = this._gl_models.length; i < models.length; i++)
			{
				this._gl_models.push(new GLModel(this._context, models[i].toArray()));
			}
		}

		gl.clearColor(1, 1, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		//process renderers
		let jobs: Map<MaterialIdentifier, RendererJob<IMaterial>> = new Map();
		for (let i = 0; i < models.length; i++)
		{
			let model = models[i];
			let glmodel = this._gl_models[i];

			let material_identifier = model.material.getMaterialIdentifier();
			if (!jobs.has(material_identifier))
			{
				jobs.set(material_identifier, new RendererJob(camera, [], this._texture_manager));
			}

			let job = jobs.get(material_identifier);
			job.models.push([model, glmodel]);
		}

		for (let [material_identifier, job] of jobs)
		{
			if (job.models.length > 0)
			{
				if (!this._renderers.has(material_identifier))
				{
					this._renderers.set(material_identifier, job.models[0][0].material.generateRenderer(this._context));
				}

				let renderer = this._renderers.get(material_identifier);
				renderer.render(job);
			}
			else
			{
				throw new Error("Each job should have at least one model associated");
			}
		}
	}
};

export default Engine;