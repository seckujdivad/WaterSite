#version 300 es

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inUV;
layout (location = 2) in vec3 inNormal;
layout (location = 3) in vec3 inTangent;

out vec4 vertPosition;
out vec2 vertUV;

uniform mat4 rotationCamera;
uniform mat4 perspective;

void main()
{
	vertUV = inUV;
	vertPosition = rotationCamera * vec4(inPosition, 1.0f);

    gl_Position = vec4(inPosition.xy, 1.0f, 1.0f);
}