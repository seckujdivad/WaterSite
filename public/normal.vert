#version 300 es

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inUV;
layout (location = 2) in vec3 inNormal;
layout (location = 3) in vec3 inTangent;

out vec3 vertPositionModel;
out vec4 vertPositionScene;
out vec4 vertPositionRelative;
out vec4 vertPosition;
out vec2 vertUV;

out mat3 vertTBN;

uniform mat4 rotationCamera;
uniform mat4 translationCamera;
uniform mat4 transformationModel;
uniform mat4 perspective;

void main()
{
	mat4 transformation = rotationCamera * translationCamera * transformationModel;

	vertPositionModel = inPosition;
	vertPositionScene = transformationModel * vec4(inPosition, 1.0f);
	vertPositionRelative = translationCamera * vertPositionScene;
	vertPosition = rotationCamera * vertPositionRelative;
	vertUV = inUV;

	vec3 transformed_tangent = normalize((transformation * vec4(inTangent, 0.0f)).xyz);
	vec3 transformed_normal = normalize((transformation * vec4(inNormal, 0.0f)).xyz);
	vertTBN = mat3(transformed_tangent, cross(transformed_normal, transformed_tangent), transformed_normal);

	gl_Position = perspective * vertPosition;
}