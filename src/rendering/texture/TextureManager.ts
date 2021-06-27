import {vec3, vec4} from "gl-matrix";

import Texture, {TextureType} from "./Texture";

class TextureManager
{
	_context: WebGL2RenderingContext;

	_textures: Map<string, WebGLTexture>;

	constructor(context: WebGL2RenderingContext)
	{
		this._context = context;
		this._textures = new Map();
	}

	getTexture(texture: Texture): WebGLTexture
	{
		let texture_hash = texture.hash();
		if (this._textures.has(texture_hash))
		{
			return this._textures.get(texture_hash);
		}
		else
		{
			const gl = this._context;
			const gl_texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, gl_texture);
			
			if (texture.type === TextureType.URL)
			{
				let url = texture.specifier as string;

				//default initialise to 1x1 black texture
				const pixel = new Uint8Array([0, 0, 0, 255]);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

				//request the full image from the server asynchronously
				const image = new Image();
				image.onload = function ()
				{
					gl.bindTexture(gl.TEXTURE_2D, gl_texture);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				};
				image.src = url;
			}
			else if (texture.type === TextureType.Vec3 || texture.type === TextureType.Vec4)
			{
				let vector: vec4;
				if (texture.type === TextureType.Vec3)
				{
					let vector_3d = texture.specifier as vec3;
					vector = vec4.fromValues(vector_3d[0], vector_3d[1], vector_3d[2], 1);
				}
				else
				{
					vector = texture.specifier as vec4;
				}
				
				vec4.multiply(vector, vector, vec4.fromValues(255, 255, 255, 255));
				
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(vector));
			}

			this._textures.set(texture_hash, gl_texture);
			return gl_texture;
		}
	}
}

export default TextureManager;