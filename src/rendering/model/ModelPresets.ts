import {vec3, vec2} from "gl-matrix";

import Model, {Vertex, Face} from "./Model";
import IMaterial from "./../material/IMaterial";


enum ModelPresets
{
	FlatPlane
};

function modelFromPreset<DerivedMaterial extends IMaterial>(model: Model<DerivedMaterial>, preset: ModelPresets): Model<DerivedMaterial>
{
	if (preset === ModelPresets.FlatPlane)
	{
		model.faces.push(new Face(vec3.fromValues(0, 0, 1),
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