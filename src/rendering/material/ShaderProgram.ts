class ShaderProgram
{
	_context: WebGL2RenderingContextStrict;

	_obj: WebGLProgram;

	_uniforms: Map<string, WebGLUniformLocation>;
	_textures: Map<string, [WebGLRenderingContextStrict.TextureTarget, WebGLTexture]>;

	constructor(context: WebGL2RenderingContextStrict, vertex_shader_source: string, fragment_shader_source: string)
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
	}

	addUniform(name: string)
	{
		const gl = this._context;
		this._uniforms.set(name, gl.getUniformLocation(this._obj, name));
	}

	getUniform(name: string): WebGLUniformLocation
	{
		return this._uniforms.get(name);
	}

	addTexture(name: string, [target, texture]: [WebGLRenderingContextStrict.TextureTarget, WebGLTexture])
	{
		this._textures.set(name, [target, texture]);
		this.addUniform(name);

		this.linkTexturesAndUniforms();

		return texture;
	}

	linkTexturesAndUniforms()
	{
		const gl = this._context;

		gl.useProgram(this._obj);
		let i = 0;
		for (const [name, [target, texture]] of this._textures)
		{
			const uniform: WebGLUniformLocation = this._uniforms.get(name);
			let texture_unit = gl.TEXTURE0 + i + 1 as WebGLRenderingContextStrict.TextureUnit
			gl.activeTexture(texture_unit);
			gl.bindTexture(target, texture);
			gl.uniform1i(uniform, i + 1);
			i += 1;
		};
		gl.activeTexture(gl.TEXTURE0);
	}

	use()
	{
		this._context.useProgram(this._obj);
	}
}

async function loadShaderProgram(context: WebGL2RenderingContextStrict, vertex_shader_url: string, fragment_shader_url: string)
{
	let shader_promises = [fetch(vertex_shader_url), fetch(fragment_shader_url)].map(promise => promise.then(response => response.text()));
	let [vertex_shader, fragment_shader] = await Promise.all(shader_promises);

	return new ShaderProgram(context, vertex_shader, fragment_shader);
}

export {ShaderProgram as default, loadShaderProgram};