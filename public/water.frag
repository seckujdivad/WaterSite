#version 300 es

precision highp float;

out vec4 frag_out;

void main()
{
	frag_out = gl_FragCoord;
}