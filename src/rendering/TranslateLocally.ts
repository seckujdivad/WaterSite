import {vec3, mat4} from "gl-matrix";

//in place rotates 'source' by 'rotation' radians
function rotateVector(source: vec3, rotation: vec3): vec3
{
	return vec3.transformMat4(source, source, createRotation(rotation));
}

function createRotation(rotation: vec3)
{
	let transformation = mat4.create();
	mat4.rotateX(transformation, transformation, rotation[0]);
	mat4.rotateY(transformation, transformation, rotation[1]);
	mat4.rotateZ(transformation, transformation, rotation[2]);
	return transformation;
}

export {rotateVector as default, createRotation};