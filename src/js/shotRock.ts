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

    sheetCanvas.onmousedown = function(mouseEvent: MouseEvent)
    {
        sheetView.OnMouseDown(mouseEvent.x, mouseEvent.y);
    }

    sheetCanvas.addEventListener("touchstart", (touchEvent: TouchEvent) =>
    {
        touchEvent.preventDefault();
        sheetView.OnMouseDown(touchEvent.touches[0].pageX, touchEvent.touches[0].pageY);
    }, false);

    sheetCanvas.onmousemove = function(mouseEvent: MouseEvent)
    {
        sheetView.OnMouseMove(mouseEvent.x, mouseEvent.y);
    }

    sheetCanvas.addEventListener("touchmove", (touchEvent: TouchEvent) =>
    {
        touchEvent.preventDefault();
        sheetView.OnMouseMove(touchEvent.touches[0].pageX, touchEvent.touches[0].pageY);
    }, false);

    sheetCanvas.onmouseup = function(mouseEvent: MouseEvent)
    {
        sheetView.OnMouseUp(mouseEvent.x, mouseEvent.y);
    }

    sheetCanvas.addEventListener("touchend", (touchEvent: TouchEvent) =>
    {
        touchEvent.preventDefault();
        sheetView.OnMouseUp(touchEvent.changedTouches[0].pageX, touchEvent.changedTouches[0].pageY);
    }, false);

    function paintCanvas() {
        sheetCanvas.width = window.innerWidth;
        sheetCanvas.height = window.innerHeight;
        sheetView.Invalidate();
    }

    setInterval(function() { sheetView.Paint(); }, 30);

    paintCanvas();
};