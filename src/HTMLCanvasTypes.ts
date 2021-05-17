function IsCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): canvas is HTMLCanvasElement
{
	return canvas instanceof HTMLCanvasElement;
};

function NarrowCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): HTMLCanvasElement
{
	if (IsCanvas(canvas))
	{
		return canvas;
	}
	else
	{
		throw new TypeError("\'canvas\' was not an HTMLCanvasElement");
	}
}

export default NarrowCanvas;