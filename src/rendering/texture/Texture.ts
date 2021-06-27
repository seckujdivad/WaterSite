import {vec3, vec4} from "gl-matrix";


enum TextureType
{
    URL,
    Vec3,
    Vec4
}

type TextureSpecifier = string | vec3 | vec4;

class Texture
{
    type: TextureType;
    specifier: TextureSpecifier;

    constructor(type: TextureType, specifier: TextureSpecifier)
    {
        this.type = type;
        this.specifier = specifier;
    }

    hash(): string
    {
        return this.type.toString() + this.specifier.toString();
    }
}

export {Texture as default, TextureType};