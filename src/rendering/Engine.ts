import {mat4, vec3} from "gl-matrix";
import WebGLDebugUtils from "webgl-debug";

import narrowCanvas from "./HTMLCanvasTypes";
import ShaderProgram from "./ShaderProgram";
import GLModel from "./model/GLModel";
import Camera from "./Camera";

function WebGLErrorCallback(error: number, function_name: string)
{
	throw WebGLDebugUtils.glEnumToString(error) + " was caused by a call to: " + function_name;
};

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
	_context: WebGL2RenderingContext;

	_shader_program: ShaderProgram;

	constructor(context: WebGL2RenderingContext)
	{
		this._context = WebGLDebugUtils.makeDebugContext(context, WebGLErrorCallback, forEachWebGLCall);
		if (this._context === null)
		{
			alert("Can't get WebGL context");
		}

		const gl = this._context;
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		this._shader_program = null;

		this.loadShaderProgram();
	};

	render(models: Array<GLModel>, camera: Camera)
	{
		const gl = this._context;

		const canvas = narrowCanvas(gl.canvas);

		gl.canvas.width = canvas.clientWidth;
		gl.canvas.height = canvas.clientHeight;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		
		if (this._shader_program !== null)
		{
			this._shader_program.use();

			//set up uniforms
			let perspective = mat4.create();
			mat4.perspective(perspective, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 100);
			gl.uniformMatrix4fv(this._shader_program.getUniform("perspective"), false, perspective);

			gl.uniformMatrix4fv(this._shader_program.getUniform("transformationCamera"), false, camera.getTransformation());
			
			//perform render
			gl.clearColor(1, 1, 1, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
			for (const model of models)
			{
				model.bind();
				model.pushVertices();
				gl.uniformMatrix4fv(this._shader_program.getUniform("transformationModel"), false, model.getTransformation());
				gl.drawArrays(gl.TRIANGLES, 0, model.num_vertices);
			}
		}
	};

	async loadShaderProgram()
	{
		let shaders = await queryShaders();
		this._shader_program = new ShaderProgram(this._context, shaders.vertex, shaders.fragment);

		this._shader_program.addUniform("transformationCamera");
		this._shader_program.addUniform("transformationModel");
		this._shader_program.addUniform("perspective");

		this._shader_program.loadTexture("wavesTexture", "./SeaWavesB_N.jpg");
		this._shader_program.loadTexture("sandTexture", "./seamless_desert_sand_texture_by_hhh316_d311qn7-fullview.jpg");
	}

	getContext()
	{
		return this._context;
	}
};

export default Engine;