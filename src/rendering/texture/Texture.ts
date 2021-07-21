import {vec3, vec4} from "gl-matrix";


enum TextureType
{
	URL,
	Vec3,
	Vec4
}

type TextureSpecifier = string | vec3 | vec4;

interface TextureSpecifierMap
{
	URL: string;
	Vec3: vec3;
	Vec4: vec4;
}

function isString(specifier: TextureSpecifier) : specifier is string
{
	return (specifier as string).search !== undefined;
}

function isVec3(specifier: TextureSpecifier) : specifier is vec3
{
	return !isString(specifier) && (specifier as vec3)[3] === undefined;
}

function isVec4(specifier: TextureSpecifier) : specifier is vec4
{
	return !isString(specifier) && (specifier as vec4)[3] !== undefined;
}

function getTextureType(specifier: TextureSpecifier)
{
	if (isString(specifier))
	{
		return TextureType.URL;
	}
	else if (isVec3(specifier))
	{
		return TextureType.Vec3;
	}
	else if (isVec4(specifier))
	{
		return TextureType.Vec4;
	}
	else
	{
		throw new Error("Unknown texture specifier type");
	}
}

class Texture
{
	specifier: TextureSpecifier;

	constructor(specifier: TextureSpecifier)
	{
		this.specifier = specifier;
	}

	hash(): string
	{
		return this.type.toString() + this.specifier.toString();
	}

	get type(): TextureType
	{
		return getTextureType(this.specifier);
	}
};

export {Texture as default, TextureType};