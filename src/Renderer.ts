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

	uniforms: {transformation: WebGLUniformLocation, waves_texture: WebGLUniformLocation};
	textures: Array<WebGLTexture>;

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
		let positions = [
			-0.5, -0.5, tri_depth, 0, 0,
			0.5, -0.5, tri_depth, 1, 0,
			0.5, 0.5, tri_depth, 1, 1,
			-0.5, 0.5, tri_depth, 0, 1
		];

		this.vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);
		gl.enableVertexAttribArray(0);
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * 4, 0);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * 4, 3 * 4);

		this.uniforms = {
			transformation: gl.getUniformLocation(this.shader_program, "transformation"),
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
		let transformation = mat4.identity(mat4.create());
		mat4.perspective(transformation, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 100);
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