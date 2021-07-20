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

function createRotation(rotation: vec3, inverse: boolean = false): mat4
{
	let transformation = mat4.create();
	mat4.rotateX(transformation, transformation, inverse ? 0 - rotation[0] : rotation[0]);
	mat4.rotateY(transformation, transformation, inverse ? 0 - rotation[1] : rotation[1]);
	mat4.rotateZ(transformation, transformation, inverse ? 0 - rotation[2] : rotation[2]);
	return transformation;
}

export {
	vec4ToArray, vec3ToArray, vec2ToArray,
	arrayToVec4, arrayToVec3, arrayToVec2,
	vecToString,
	vec4To3, vec3To4,
	createRotation
};