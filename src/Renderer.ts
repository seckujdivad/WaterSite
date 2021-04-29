import {glMatrix, mat4, vec3} from "gl-matrix";
import WebGLDebugUtils from "webgl-debug";

import App from "./App.jsx";


function WebGLErrorCallback(error: number, function_name: string)
{
	throw WebGLDebugUtils.glEnumToString(error) + " was caused by a call to: " + function_name;
};

class Renderer
{
	app: App;
	
	context: WebGL2RenderingContext;

	shader_program: WebGLProgram;
	vao: WebGLVertexArrayObject;
	vbo: WebGLBuffer;

	uniforms: {
		transformation: WebGLUniformLocation,
		perspective: WebGLUniformLocation,
		waves_texture: WebGLUniformLocation
	};

	textures: WebGLTexture[];

	constructor(app: App, context: WebGL2RenderingContext, vertex_shader_source: string, fragment_shader_source: string)
	{
		this.app = app;
		this.context = WebGLDebugUtils.makeDebugContext(context, WebGLErrorCallback);
		const gl = this.context;
		if (this.context === null)
		{
			alert("Can't get WebGL context");
		}

		this.textures = [];

		{
			let vert_shader = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vert_shader, vertex_shader_source);
			gl.compileShader(vert_shader);
			if (!gl.getShaderParameter(vert_shader, gl.COMPILE_STATUS))
			{
				alert(gl.getShaderInfoLog(vert_shader));
			}

			let frag_shader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(frag_shader, fragment_shader_source);
			gl.compileShader(frag_shader);
			if (!gl.getShaderParameter(frag_shader, gl.COMPILE_STATUS))
			{
				alert(gl.getShaderInfoLog(frag_shader));
			}

			this.shader_program = gl.createProgram();
			gl.attachShader(this.shader_program, vert_shader);
			gl.attachShader(this.shader_program, frag_shader);
			gl.linkProgram(this.shader_program);

			if (!gl.getProgramParameter(this.shader_program, gl.LINK_STATUS))
			{
				alert(gl.getProgramInfoLog(this.shader_program));
			}

			gl.deleteShader(vert_shader);
			gl.deleteShader(frag_shader);
		}

		let tri_depth = -4;
		let tri_data = [
			[
				{position: [-0.5, -0.5, tri_depth], uv: [0, 0]},
				{position: [0.5, -0.5, tri_depth], uv: [1, 0]},
				{position: [-0.5, 0.5, tri_depth], uv: [0, 1]}
			],
			[
				{position: [0.5, -0.5, tri_depth], uv: [1, 0]},
				{position: [0.5, 0.5, tri_depth], uv: [1, 1]},
				{position: [-0.5, 0.5, tri_depth], uv: [0, 1]}
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

		this.uniforms = {
			transformation: gl.getUniformLocation(this.shader_program, "transformation"),
			perspective: gl.getUniformLocation(this.shader_program, "perspective"),
			waves_texture: gl.getUniformLocation(this.shader_program, "wavesTexture")
		};

		let waves_texture = this.LoadTexture("./SeaWavesB_N.jpg");
		this.textures.push(waves_texture);

		gl.useProgram(this.shader_program);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, waves_texture);
		gl.uniform1i(this.uniforms.waves_texture, 0);
	}

	Render()
	{
		const gl = this.context;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.useProgram(this.shader_program);

		//set up uniforms
		let perspective = mat4.identity(mat4.create());
		mat4.perspective(perspective, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 100);
		gl.uniformMatrix4fv(this.uniforms.perspective, false, perspective);

		let transformation = mat4.identity(mat4.create());
		gl.uniformMatrix4fv(this.uniforms.transformation, false, transformation);
		
		//perform render
		gl.clearColor(1, 1, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.bindVertexArray(this.vao);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}

	Destroy()
	{
		const gl = this.context;
		gl.deleteProgram(this.shader_program);
		gl.deleteVertexArray(this.vao);
		gl.deleteBuffer(this.vbo);

		this.textures.forEach(gl.deleteTexture);
	}

	//https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
	LoadTexture(url: string): WebGLTexture
	{
		const gl = this.context;
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		//default initialise to 1x1 black texture
		const pixel = new Uint8Array([0, 0, 0, 255]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

		const image = new Image();
		image.onload = function ()
		{
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		};
		image.src = url;

		return texture;
	}
}

export default Renderer;