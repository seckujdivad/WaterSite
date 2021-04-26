#version 300 es

in vec3 vertPosition;

uniform mat4 projection;

void main()
{
	gl_Position = vec4(vertPosition, 1.0f);
}