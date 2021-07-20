import {mat4} from "gl-matrix";
import WebGLDebugUtils from "webgl-debug";

import narrowCanvas from "./HTMLCanvasTypes";
import ShaderProgram from "./ShaderProgram";
import GLModel from "./model/GLModel";
import Model from "./model/Model";
import Camera from "./Camera";
import TextureManager from "./texture/TextureManager";


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

async function queryShaders()
{
	let [vertex_shader_req, fragment_shader_req] = await Promise.all([fetch("water.vert"), fetch("water.frag")]);
	let [vertex_shader, fragment_shader] = await Promise.all([vertex_shader_req.text(), fragment_shader_req.text()]);
	return {vertex: vertex_shader, fragment: fragment_shader};
}

class Engine
{
	_context: WebGL2RenderingContextStrict;

	_shader_program: ShaderProgram;
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

		const gl = this._context;
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		this._shader_program = null;

		this.loadShaderProgram();
	}

	render(models: Array<Model>, camera: Camera)
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
		
		if (this._shader_program !== null)
		{
			this._shader_program.use();

			//set up uniforms
			let perspective = mat4.create();
			mat4.perspective(perspective, camera.vfov, gl.canvas.width / gl.canvas.height, 0.1, 100);
			gl.uniformMatrix4fv(this._shader_program.getUniform("perspective"), false, perspective);

			gl.uniformMatrix4fv(this._shader_program.getUniform("transformationCamera"), false, camera.getTransformation());
			
			//perform render
			gl.clearColor(1, 1, 1, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
			for (let i = 0; i < models.length; i++)
			{
				const model = models[i];
				const glmodel = this._gl_models[i];

				this._shader_program.addTexture("textureColour", this._texture_manager.getTexture(model.textures.colour));
				this._shader_program.addTexture("textureNormal", this._texture_manager.getTexture(model.textures.normal));

				glmodel.bind();

				gl.uniformMatrix4fv(this._shader_program.getUniform("transformationModel"), false, model.getTransformation());
				gl.drawArrays(gl.TRIANGLES, 0, model.getNumVertices());
			}
		}
	}

	async loadShaderProgram()
	{
		let shaders = await queryShaders();
		this._shader_program = new ShaderProgram(this._context, shaders.vertex, shaders.fragment);

		this._shader_program.addUniform("transformationCamera");
		this._shader_program.addUniform("transformationModel");
		this._shader_program.addUniform("perspective");
	}

	getContext()
	{
		return this._context;
	}
};

export default Engine;