#version 300 es

precision highp float;

in vec4 vertPosition;
in vec2 vertUV;

out vec4 frag_out;

uniform samplerCube skyboxTexture;

vec3 PerspDiv(vec4 vec)
{
    return vec.xyz / vec.w;
}

void main()
{
    vec3 position = PerspDiv(vertPosition);
    frag_out = texture(skyboxTexture, position);
}