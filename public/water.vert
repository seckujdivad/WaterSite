#version 300 es

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inUV;

out vec3 vertPosition;
out vec2 vertUV;

uniform mat4 transformation;

void main()
{
	vertPosition = inPosition;
	vertUV = inUV;

	gl_Position = transformation * vec4(inPosition, 1.0f);
}