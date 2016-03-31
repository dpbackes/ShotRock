/// <reference path="./View/sheetView.ts"/>
/// <reference path="./ViewModel/sheetModel.ts"/>
window.onload = function()
{
	var sheetCanvas = <HTMLCanvasElement>document.getElementById("mainSheet");

	var sheetModel = new ViewModel.SheetModel();
	var sheetView = new View.SheetView(sheetCanvas, sheetModel);

	window.onresize = function(){
		 paintCanvas();
	}

	sheetCanvas.onclick = function(mouseEvent: MouseEvent)
	{
		sheetView.OnClick(mouseEvent.x, mouseEvent.y);
	}

	sheetCanvas.onmousedown = function(mouseEvent: MouseEvent)
	{
		sheetView.OnMouseDown(mouseEvent.x, mouseEvent.y);
	}

	sheetCanvas.onmousemove = function(mouseEvent: MouseEvent)
	{
		sheetView.OnMouseMove(mouseEvent.x, mouseEvent.y);
	}

	sheetCanvas.onmouseup = function(mouseEvent: MouseEvent)
	{
		sheetView.OnMouseUp(mouseEvent.x, mouseEvent.y);
	}

	function paintCanvas() {
		sheetCanvas.width = window.innerWidth;
		sheetCanvas.height = window.innerHeight;
		sheetView.Invalidate();
	}

	setInterval(function() { sheetView.Paint(); }, 30);

	paintCanvas();
};