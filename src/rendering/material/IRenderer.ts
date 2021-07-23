import RendererJob from "./RendererJob";
import IMaterial from "./IMaterial";


interface IRenderer<DerivedMaterial extends IMaterial>
{
	render(job: RendererJob<DerivedMaterial>): void;
};

export default IRenderer;