class ShaderProgram
{
	_context: WebGL2RenderingContext;

	_obj: WebGLProgram;

	_uniforms: Map<string, WebGLUniformLocation>;
	_textures: Map<string, WebGLTexture>;

	constructor(context: WebGL2RenderingContext, vertex_shader_source: string, fragment_shader_source: string)
	{
		this._context = context;
		const gl = this._context;

		this._uniforms = new Map();
		this._textures = new Map();

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

		this._obj = gl.createProgram();
		gl.attachShader(this._obj, vert_shader);
		gl.attachShader(this._obj, frag_shader);
		gl.linkProgram(this._obj);

		if (!gl.getProgramParameter(this._obj, gl.LINK_STATUS))
		{
			alert(gl.getProgramInfoLog(this._obj));
		}
	};

	addUniform(name: string)
	{
		const gl = this._context;
		this._uniforms.set(name, gl.getUniformLocation(this._obj, name));
	};

	getUniform(name: string): WebGLUniformLocation
	{
		return this._uniforms.get(name);
	};

	loadTexture(name: string, url: string): WebGLTexture
	{
		const gl = this._context;
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

		this._textures.set(name, texture);
		this.addUniform(name);

		this.setTextures();

		return texture;
	};

	setTextures()
	{
		const gl = this._context;

		gl.useProgram(this._obj);
		let i = 0;
		for (const [name, texture] of this._textures)
		{
			const uniform: WebGLUniformLocation = this._uniforms.get(name);
			gl.activeTexture(gl.TEXTURE0 + i + 1);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.uniform1i(uniform, i + 1);
			i += 1;
		};
		gl.activeTexture(gl.TEXTURE0);
	};

	use()
	{
		this._context.useProgram(this._obj);
	};
};

export default ShaderProgram;