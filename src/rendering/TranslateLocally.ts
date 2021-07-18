import {vec3, mat4, mat3} from "gl-matrix";

//in place rotates 'source' by 'rotation' radians
function rotateVector(source: vec3, rotation: vec3): vec3
{
	let transformation = mat4.fromXRotation(mat4.create(), rotation[0]);
	mat4.rotateY(transformation, transformation, rotation[1]);
	mat4.rotateZ(transformation, transformation, rotation[2]);
	return vec3.transformMat4(source, source, transformation);
}

export default rotateVector;