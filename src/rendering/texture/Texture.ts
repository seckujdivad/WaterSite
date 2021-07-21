import {vec3, vec4} from "gl-matrix";


type Texture = string | vec3 | vec4;

function isURL(texture: Texture) : texture is string
{
	return (texture as string).search !== undefined;
}

function isVec3(texture: Texture) : texture is vec3
{
	return !isURL(texture) && (texture as vec3)[3] === undefined;
}

function isVec4(texture: Texture) : texture is vec4
{
	return !isURL(texture) && (texture as vec4)[3] !== undefined;
}

function hashTexture(texture: Texture): string
{
	if (isURL(texture))
	{
		return "0" + texture;
	}
	else if (isVec3(texture))
	{
		return "1" + texture.toString();
	}
	else if (isVec4(texture))
	{
		return "2" + texture.toString();
	}
	else
	{
		throw new Error("Unknown texture type");
	}
}

export {Texture as default, hashTexture, isURL, isVec3, isVec4};