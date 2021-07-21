import {vec3, vec4} from "gl-matrix";

import Texture, {isURL, isVec3, isVec4, hashTexture} from "./Texture";


class TextureManager
{
	_context: WebGL2RenderingContextStrict;

	_textures: Map<string, WebGLTexture>;

	constructor(context: WebGL2RenderingContextStrict)
	{
		this._context = context;
		this._textures = new Map();
	}

	getTexture(texture: Texture): WebGLTexture
	{
		let texture_hash = hashTexture(texture);
		if (this._textures.has(texture_hash))
		{
			return this._textures.get(texture_hash);
		}
		else
		{
			const gl = this._context;
			const gl_texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, gl_texture);
			
			if (isURL(texture))
			{
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
				image.src = texture;
			}
			else
			{
				let colour: vec4;
				if (isVec3(texture))
				{
					colour = vec4.fromValues(texture[0], texture[1], texture[2], 1);
				}
				else if (isVec4(texture))
				{
					colour = texture;
				}
				else
				{
					throw new Error("Unknown texture type");
				}

				vec4.multiply(colour, colour, vec4.fromValues(255, 255, 255, 255));
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(colour));
			}

			this._textures.set(texture_hash, gl_texture);
			return gl_texture;
		}
	}
}

export default TextureManager;