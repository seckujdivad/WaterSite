class ShaderProgram
{
	context: WebGL2RenderingContext;

	obj: WebGLProgram;

	uniforms: Map<string, WebGLUniformLocation>;
	textures: Map<string, WebGLTexture>;

	constructor(context: WebGL2RenderingContext, vertex_shader_source: string, fragment_shader_source: string)
	{
		this.context = context;
		const gl = this.context;

		this.uniforms = new Map();
		this.textures = new Map();

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

		this.obj = gl.createProgram();
		gl.attachShader(this.obj, vert_shader);
		gl.attachShader(this.obj, frag_shader);
		gl.linkProgram(this.obj);

		if (!gl.getProgramParameter(this.obj, gl.LINK_STATUS))
		{
			alert(gl.getProgramInfoLog(this.obj));
		}

		gl.deleteShader(vert_shader);
		gl.deleteShader(frag_shader);
	};

	destroy()
	{
		const gl = this.context;
		gl.deleteProgram(this.obj);
		for (const [name, texture] of this.textures)
		{
			gl.deleteTexture(texture);
		}
	};

	addUniform(name: string)
	{
		const gl = this.context;
		this.uniforms.set(name, gl.getUniformLocation(this.obj, name));
	}

	loadTexture(name: string, url: string): WebGLTexture
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

		this.textures.set(name, texture);
		this.addUniform(name);

		this.setTextures();

		return texture;
	};

	setTextures()
	{
		const gl = this.context;

		gl.useProgram(this.obj);
		let i = 0;
		for (const [name, texture] of this.textures)
		{
			const uniform: WebGLUniformLocation = this.uniforms.get(name);
			gl.activeTexture(gl.TEXTURE0 + i + 1);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.uniform1i(uniform, i + 1);
			i += 1;
		};
		gl.activeTexture(gl.TEXTURE0);
	};

	use()
	{
		this.context.useProgram(this.obj);
	};
};

export default ShaderProgram;