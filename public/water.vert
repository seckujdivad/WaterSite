#version 300 es

in vec3 inPosition;

out vec3 vertPosition;

uniform mat4 transformation;

void main()
{
	vertPosition = inPosition;

	gl_Position = transformation * vec4(inPosition, 1.0f);
}