#version 300 es

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inUV;
layout (location = 2) in vec3 inNormal;
layout (location = 3) in vec3 inTangent;

out vec4 vertPosition;
out vec3 vertSampleVec;

uniform mat4 rotationCamera;
uniform mat4 perspective;

void main()
{
	vertSampleVec = inPosition;
	vertPosition = perspective * rotationCamera * vec4(inPosition, 1.0f);

    gl_Position = vec4(vertPosition.xy, vertPosition.w, vertPosition.w);
}