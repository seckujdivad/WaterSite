import IRenderer from "./IRenderer";
import MaterialIdentifier from "./MaterialIdentifier";


interface IMaterial
{
	generateRenderer(context: WebGL2RenderingContextStrict): IRenderer<IMaterial>;

	getMaterialIdentifier(): MaterialIdentifier; //one single MaterialIdentifier should exist per Material/Renderer pair
};

export {IMaterial as default};