import Model, {Vertex, Face} from "./Model";
import {vec3, vec2} from "gl-matrix";

enum ModelPresets
{
    FlatPlane
};

function modelFromPreset(model: Model, preset: ModelPresets): Model
{
    if (preset === ModelPresets.FlatPlane)
    {
        model.addFace(new Face(vec3.fromValues(0, 0, 1),
            [
                new Vertex(vec3.fromValues(-0.5, -0.5, 0), vec2.fromValues(0, 0)),
                new Vertex(vec3.fromValues(0.5, -0.5, 0), vec2.fromValues(1, 0)),
                new Vertex(vec3.fromValues(0.5, 0.5, 0), vec2.fromValues(1, 1)),
                new Vertex(vec3.fromValues(-0.5, 0.5, 0), vec2.fromValues(0, 1))
            ]));
        return model;
    }
    else
    {
        throw RangeError("Unknown preset");
    }
}

export {ModelPresets as default, modelFromPreset};