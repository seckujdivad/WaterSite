#version 300 es

precision highp float;

in vec3 vertPosition;
in vec2 vertUV;
in mat3 vertTBN;

out vec4 frag_out;

uniform sampler2D wavesTexture;

const vec3 SUN_ANGLE = normalize(vec3(0.2f, 0.2f, -1.0f));
const vec3 FRAG_TO_SUN = 0.0f - SUN_ANGLE;
const vec3 SUN_COLOUR = vec3(1.0f);

const vec3 BASE_NORMAL = vec3(0.0f, 0.0f, 1.0f);

const vec3 SPECULAR = vec3(0.5f);
const vec3 DIFFUSE = vec3(0.1f);

void main()
{
	vec3 normal = vertTBN * ((texture(wavesTexture, vertUV).xyz * 2.0f) - 1.0f);

	vec3 colour = vec3(0.5f);
	colour += DIFFUSE * SUN_COLOUR * max(dot(normal, FRAG_TO_SUN), 0.0f);
	colour += SPECULAR * SUN_COLOUR * pow(max(dot(reflect(SUN_ANGLE, normal), normalize(0.0f - vertPosition)), 0.0f), 32.0f);

	frag_out = vec4(colour, 1.0f);
}