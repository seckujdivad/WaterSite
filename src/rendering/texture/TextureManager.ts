import {vec4} from "gl-matrix";

import Texture, {isURL, isVec3, isVec4, hashTexture, TextureType} from "./Texture";


class TextureManager
{
	_context: WebGL2RenderingContextStrict;

	_textures: Map<string, [WebGLRenderingContextStrict.TextureTarget, WebGLTexture]>;

	constructor(context: WebGL2RenderingContextStrict)
	{
		this._context = context;
		this._textures = new Map();
	}

	getTexture(texture: Texture): [WebGLRenderingContextStrict.TextureTarget, WebGLTexture]
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
			
			let texture_enum: WebGLRenderingContextStrict.TextureTarget = gl.TEXTURE_2D;
			if (texture.type === TextureType.Texture2D)
			{
				texture_enum = gl.TEXTURE_2D;
			}
			else if (texture.type === TextureType.TextureCubemap)
			{
				texture_enum = gl.TEXTURE_CUBE_MAP;
			}
			else
			{
				throw new Error("Unrecognised TextureType");
			}

			gl.bindTexture(texture_enum, gl_texture);

			gl.texParameteri(texture_enum, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(texture_enum, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(texture_enum, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

			gl.texParameteri(texture_enum, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(texture_enum, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			
			if (isURL(texture.data))
			{
				//default initialise to 1x1 black texture
				setWebGLTextureToColour(gl, gl_texture, texture.type, vec4.fromValues(0, 0, 0, 1));

				//request the full image from the server asynchronously
				const image = new Image();
				image.onload = function ()
				{
					gl.bindTexture(texture_enum, gl_texture);
					if (texture.type === TextureType.Texture2D)
					{
						gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
					}
					else if (texture.type === TextureType.TextureCubemap)
					{
						let targets = [
							gl.TEXTURE_CUBE_MAP_POSITIVE_X,
							gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
							gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
							gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
							gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
							gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
						];

						for (const target of targets)
						{
							gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
						}
					}
					else
					{
						throw new Error("Unrecognised TextureType");
					}
				};
				image.src = texture.data;
			}
			else
			{
				let colour: vec4;
				if (isVec3(texture.data))
				{
					colour = vec4.fromValues(texture.data[0], texture.data[1], texture.data[2], 1);
				}
				else if (isVec4(texture.data))
				{
					colour = texture.data;
				}
				else
				{
					throw new Error("Unknown texture type");
				}

				setWebGLTextureToColour(gl, gl_texture, texture.type, colour);
			}

			let gl_texture_data: [WebGLRenderingContextStrict.TextureTarget, WebGLTexture] = [texture_enum, gl_texture];
			this._textures.set(texture_hash, gl_texture_data);
			return gl_texture_data;
		}
	}
}

function setWebGLTextureToColour(context: WebGL2RenderingContextStrict, texture: WebGLTexture, texture_type: TextureType, colour: vec4): void
{
	const gl = context;

	let pixel = new Uint8Array(vec4.multiply(vec4.create(), colour, vec4.fromValues(255, 255, 255, 255)));
	if (texture_type === TextureType.Texture2D)
	{
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
	}
	else if (texture_type === TextureType.TextureCubemap)
	{
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
		for (let i = 0; i < 6; i++)
		{
			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i as WebGLRenderingContextStrict.TexImage2DTarget, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
		}
	}
}

export default TextureManager;