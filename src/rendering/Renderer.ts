import {mat4, vec3} from "gl-matrix";
import WebGLDebugUtils from "webgl-debug";

import narrowCanvas from "./HTMLCanvasTypes";
import ShaderProgram from "./ShaderProgram";
import GLModel from "./model/GLModel";
import ModelPresets, {modelFromPreset} from "./model/ModelPresets";
import {loadPLYModelFromURL} from "./model/PlyLoader"

function WebGLErrorCallback(error: number, function_name: string)
{
	throw WebGLDebugUtils.glEnumToString(error) + " was caused by a call to: " + function_name;
};

class Renderer
{
	#context: WebGL2RenderingContext;

	#shader_program: ShaderProgram;

	#models: Array<GLModel>;

	constructor(context: WebGL2RenderingContext, vertex_shader_source: string, fragment_shader_source: string)
	{
		this.#context = WebGLDebugUtils.makeDebugContext(context, WebGLErrorCallback);
		if (this.#context === null)
		{
			alert("Can't get WebGL context");
		}

		const gl = this.#context;
		gl.disable(gl.CULL_FACE);

		this.#shader_program = new ShaderProgram(context, vertex_shader_source, fragment_shader_source);

		this.#models = [];

		let model = new GLModel(this.#context);
		loadPLYModelFromURL(model, "cube.ply");
		//modelFromPreset(model, ModelPresets.FlatPlane);
		this.#models.push(model);

		this.#shader_program.addUniform("transformation");
		this.#shader_program.addUniform("perspective");

		this.#shader_program.loadTexture("wavesTexture", "./SeaWavesB_N.jpg");
		this.#shader_program.loadTexture("sandTexture", "./seamless_desert_sand_texture_by_hhh316_d311qn7-fullview.jpg");
	};

	render()
	{
		const gl = this.#context;

		const canvas = narrowCanvas(gl.canvas);

		gl.canvas.width = canvas.clientWidth;
		gl.canvas.height = canvas.clientHeight;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		this.#shader_program.use();

		//set up uniforms
		let perspective = mat4.identity(mat4.create());
		mat4.perspective(perspective, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 100);
		gl.uniformMatrix4fv(this.#shader_program.getUniform("perspective"), false, perspective);

		let transformation = mat4.identity(mat4.create());
		mat4.translate(transformation, transformation, vec3.fromValues(0, 0, -3));
		mat4.scale(transformation, transformation, vec3.fromValues(1, 1, 1));
		gl.uniformMatrix4fv(this.#shader_program.getUniform("transformation"), false, transformation);
		
		//perform render
		gl.clearColor(1, 1, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		for (const model of this.#models)
		{
			model.bind();
			gl.drawArrays(gl.TRIANGLES, 0, model.num_vertices);
		}
	};
};

export default Renderer;