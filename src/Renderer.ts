import {mat4, vec3} from "gl-matrix";

import App from "./App.jsx";


class Renderer
{
	app: App;
	
	context: WebGL2RenderingContext;

	shader_program: WebGLProgram;
	vao: WebGLVertexArrayObject;
	vbo: WebGLBuffer;

	uniforms: {transformation: WebGLUniformLocation};

	constructor(app: App, context: WebGL2RenderingContext, vertex_shader_source: string, fragment_shader_source: string)
	{
		this.app = app;
		this.context = context;
		const gl = this.context;
		if (this.context === null)
		{
			alert("Can't get WebGL context");
		}

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

		let pos_attrib_location = gl.getAttribLocation(this.shader_program, "vertPosition");

		this.vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		let positions = [
			0, 0, 0.5,
			0, 0.5, 0.5,
			0.7, 0, 0.5
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);
		gl.enableVertexAttribArray(pos_attrib_location);
		gl.vertexAttribPointer(pos_attrib_location, 3, gl.FLOAT, false, 0, 0);

		this.uniforms = {
			transformation: gl.getUniformLocation(this.shader_program, "transformation")
		};
	}

	Render()
	{
		const gl = this.context;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		//set up uniforms
		let transformation = mat4.identity(mat4.create()); //glm.mat4(2); // = glm.perspective(glm.pi / 4, gl.canvas.width / gl.canvas.height, 0.1, 100);
		mat4.scale(transformation, transformation, [2, 2, 2]);
		gl.uniformMatrix4fv(this.uniforms.transformation, false, transformation);
		
		//perform render
		gl.clearColor(1, 1, 1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.useProgram(this.shader_program);
		gl.bindVertexArray(this.vao);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}

	Destroy()
	{
		const gl = this.context;
		gl.deleteProgram(this.shader_program);
		gl.deleteVertexArray(this.vao);
		gl.deleteBuffer(this.vbo);
	}
}

export default Renderer;