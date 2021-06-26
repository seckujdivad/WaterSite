import {mat4, vec3} from "gl-matrix";

class Camera
{
    position: vec3;
    rotation: vec3;

    constructor(position: vec3, rotation: vec3)
    {
        this.position = position;
        this.rotation = rotation;
    }

    getTransformation(): mat4
    {
        let transformation: mat4 = mat4.create();

        let translate_vec = vec3.create();
        vec3.subtract(translate_vec, vec3.create(), this.position);
        mat4.translate(transformation, transformation, translate_vec);

        mat4.rotateX(transformation, transformation, this.rotation[0]);
        mat4.rotateY(transformation, transformation, this.rotation[1]);
        mat4.rotateZ(transformation, transformation, this.rotation[2]);

        return transformation;
    }
}

export default Camera;