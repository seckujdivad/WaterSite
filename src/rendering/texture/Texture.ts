import {vec3, vec4} from "gl-matrix";


//if the number of enumerators ever gets to double digits, hashTextureType will need to be rewritten
enum TextureType
{
	Texture2D,
	TextureCubemap
}

type TextureData = string | vec3 | vec4;

class Texture
{
	type: TextureType;
	data: TextureData;
};

function isURL(texture_data: TextureData) : texture_data is string
{
	return typeof texture_data === "string";
}

function isVec3(texture_data: TextureData) : texture_data is vec3
{
	return Array.isArray(texture_data) && texture_data.length === 3;
}

function isVec4(texture_data: TextureData) : texture_data is vec4
{
	return Array.isArray(texture_data) && texture_data.length === 4;
}

function hashTextureData(texture_data: TextureData): string
{
	if (isURL(texture_data))
	{
		return "0" + texture_data;
	}
	else if (isVec3(texture_data))
	{
		return "1" + texture_data.toString();
	}
	else if (isVec4(texture_data))
	{
		return "2" + texture_data.toString();
	}
	else
	{
		throw new Error("Unknown texture type");
	}
}

function hashTextureType(texture_type: TextureType): string
{
	return texture_type.toString();
}

function hashTexture(texture: Texture): string
{
	return hashTextureType(texture.type) + hashTextureData(texture.data);
}

export {Texture as default, hashTexture, isURL, isVec3, isVec4, TextureType};