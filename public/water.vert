#version 300 es

in vec3 vertPosition;

uniform mat4 transformation;

void main()
{
	gl_Position = transformation * vec4(vertPosition, 1.0f);
}