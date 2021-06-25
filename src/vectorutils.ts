import {vec4, vec3, vec2} from "gl-matrix";

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

export {vec4ToArray, vec3ToArray, vec2ToArray, arrayToVec4, arrayToVec3, arrayToVec2};