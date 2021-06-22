import {glMatrix, mat4, vec3} from "gl-matrix";
import WebGLDebugUtils from "webgl-debug";

import App from "./App.jsx";
import narrowCanvas from "./HTMLCanvasTypes";
import ShaderProgram from "./ShaderProgram";


function WebGLErrorCallback(error: number, function_name: string)
{
	throw WebGLDebugUtils.glEnumToString(error) + " was caused by a call to: " + function_name;
};

class Renderer
{
	context: WebGL2RenderingContext;

	vao: WebGLVertexArrayObject;
	vbo: WebGLBuffer;

	shader_program: ShaderProgram;

	constructor(context: WebGL2RenderingContext, vertex_shader_source: string, fragment_shader_source: string)
	{
		this.context = WebGLDebugUtils.makeDebugContext(context, WebGLErrorCallback);
		const gl = this.context;
		if (this.context === null)
		{
			alert("Can't get WebGL context");
		}

		this.shader_program = new ShaderProgram(context, vertex_shader_source, fragment_shader_source);

		let tri_data = [
			[
				{position: [-0.5, -0.5, 0], uv: [0, 0]},
				{position: [0.5, -0.5, 0], uv: [1, 0]},
				{position: [-0.5, 0.5, 0], uv: [0, 1]}
			],
			[
				{position: [0.5, -0.5, 0], uv: [1, 0]},
				{position: [0.5, 0.5, 0], uv: [1, 1]},
				{position: [-0.5, 0.5, 0], uv: [0, 1]}
			]
		];
		let normal = [0, 0, 1];
		let tangent = [1, 0, 0];

		let positions: number[] = [];
		for (const triangle of tri_data)
		{
			for (const vertex of triangle)
			{
				for (const value of vertex.position)
				{
					positions.push(value);
				}

				for (const value of vertex.uv)
				{
					positions.push(value);
				}

				for (const value of normal)
				{
					positions.push(value);
				}

				for (const value of tangent) //only works when this is a simple plane, will need to calculate for more complex geometry
				{
					positions.push(value);
				}
			}
		}

		this.vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);
		gl.enableVertexAttribArray(0);
		gl.enableVertexAttribArray(1);
		gl.enableVertexAttribArray(2);
		gl.enableVertexAttribArray(3);

		const SIZEOF_FLOAT = 4;
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 11 * SIZEOF_FLOAT, 0);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 11 * SIZEOF_FLOAT, 3 * SIZEOF_FLOAT);
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 11 * SIZEOF_FLOAT, 5 * SIZEOF_FLOAT);
		gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 11 * SIZEOF_FLOAT, 8 * SIZEOF_FLOAT);

		this.shader_program.addUniform("transformation");
		this.shader_program.addUniform("perspective");

		this.shader_program.loadTexture("wavesTexture", "./SeaWavesB_N.jpg");
		this.shader_program.loadTexture("sandTexture", "./seamless_desert_sand_texture_by_hhh316_d311qn7-fullview.jpg");
	};

	render()
	{
		const gl = this.context;

		const canvas = narrowCanvas(gl.canvas);

		gl.canvas.width = canvas.clientWidth;
		gl.canvas.height = canvas.clientHeight;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		this.shader_program.use();

		//set up uniforms
		let perspective = mat4.identity(mat4.create());
		mat4.perspective(perspective, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 100);
		gl.uniformMatrix4fv(this.shader_program.uniforms.get("perspective"), false, perspective);

		let transformation = mat4.identity(mat4.create());
		mat4.translate(transformation, transformation, vec3.fromValues(0, 0, -1));
		gl.uniformMatrix4fv(this.shader_program.uniforms.get("transformation"), false, transformation);
		
		//perform render
		gl.clearColor(1, 1, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.bindVertexArray(this.vao);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	};

	destroy()
	{
		const gl = this.context;
		gl.deleteVertexArray(this.vao);
		gl.deleteBuffer(this.vbo);

		this.shader_program.destroy();
	};
};

export default Renderer;