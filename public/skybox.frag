#version 300 es

precision highp float;

in vec4 vertPosition;
in vec3 vertSampleVec;

out vec4 frag_out;

uniform samplerCube skyboxTexture;

void main()
{
	frag_out = vec4(texture(skyboxTexture, vertSampleVec).rgb, 1.0f);
}