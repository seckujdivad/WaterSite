import {mat4, vec4, vec3, vec2} from "gl-matrix";


function vec4ToArray(vector: vec4): Array<number>
{
	return [
		vector[0],
		vector[1],
		vector[2],
		vector[3]
	];
}

function vec3ToArray(vector: vec3): Array<number>
{
	return [
		vector[0],
		vector[1],
		vector[2]
	];
}

function vec2ToArray(vector: vec2): Array<number>
{
	return [
		vector[0],
		vector[1]
	];
}

function arrayToVec4(values: Array<number>): vec4
{
	return vec4.fromValues(values[0], values[1], values[2], values[3]);
}

function arrayToVec3(values: Array<number>): vec3
{
	return vec3.fromValues(values[0], values[1], values[2]);
}

function arrayToVec2(values: Array<number>): vec2
{
	return vec2.fromValues(values[0], values[1]);
}

function vecToString(values: vec4 | vec3 | vec2, num_places: number = 0)
{
	let result = "";
	for (let i = 0; i < values.length - 1; i++)
	{
		result += values[i].toFixed(num_places) + ", ";
	}
	return result + values[values.length - 1].toFixed(num_places);
}

function vec3To4(vec: vec3)
{
	return vec4.fromValues(vec[0], vec[1], vec[2], 0);
}

function vec4To3(vec: vec4)
{
	return vec3.fromValues(vec[0], vec[1], vec[2]);
}

function applyRotation(apply_to: mat4, rotation: vec3, inverse: boolean = false): mat4
{
	mat4.rotateX(apply_to, apply_to, inverse ? 0 - rotation[0] : rotation[0]);
	mat4.rotateY(apply_to, apply_to, inverse ? 0 - rotation[1] : rotation[1]);
	mat4.rotateZ(apply_to, apply_to, inverse ? 0 - rotation[2] : rotation[2]);
	return apply_to;
}

function vecMod<vec = vec4 | vec3 | vec2>(apply_to: vec, rhs: vec): vec
{
	apply_to[0] = apply_to[0] % rhs[0];
	apply_to[1] = apply_to[1] % rhs[1];

	if (2 in apply_to)
	{
		apply_to[2] = apply_to[2] % rhs[2];
	}

	if (3 in apply_to)
	{
		apply_to[3] = apply_to[3] % rhs[3];
	}

	return apply_to;
}

function vecModScalar<vec = vec4 | vec3 | vec2>(apply_to: vec, rhs: number): vec
{
	apply_to[0] = apply_to[0] % rhs;
	apply_to[1] = apply_to[1] % rhs;

	if (2 in apply_to)
	{
		apply_to[2] = apply_to[2] % rhs;
	}

	if (3 in apply_to)
	{
		apply_to[3] = apply_to[3] % rhs;
	}

	return apply_to;
}

export {
	vec4ToArray, vec3ToArray, vec2ToArray,
	arrayToVec4, arrayToVec3, arrayToVec2,
	vecToString,
	vec4To3, vec3To4,
	applyRotation,
	vecMod, vecModScalar
};