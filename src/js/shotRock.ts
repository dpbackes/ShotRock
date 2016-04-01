/// <reference path="./Helpers/CartesianPoint.ts"/>
/// <reference path="./View/sheetView.ts"/>
/// <reference path="./ViewModel/sheetModel.ts"/>

var sheetView : View.SheetView;

window.onload = function()
{
    var sheetCanvas = <HTMLCanvasElement>document.getElementById("mainSheet");

    var sheetModel = new ViewModel.SheetModel();
    sheetView = new View.SheetView(sheetCanvas, sheetModel);

    window.onresize = function(){
         paintCanvas();
    }

    sheetCanvas.onmousedown = function(mouseEvent: MouseEvent)
    {
        ConvertToCanvasAndCall(mouseEvent.x, mouseEvent.y, (x: number, y: number) => sheetView.OnMouseDown(x, y));
    }

    sheetCanvas.addEventListener("touchstart", (touchEvent: TouchEvent) =>
    {
        touchEvent.preventDefault();
        ConvertToCanvasAndCall(touchEvent.touches[0].pageX, touchEvent.touches[0].pageY, (x: number, y: number) => sheetView.OnMouseDown(x, y));
    }, false);

    sheetCanvas.onmousemove = function(mouseEvent: MouseEvent)
    {
        ConvertToCanvasAndCall(mouseEvent.x, mouseEvent.y, (x: number, y: number) => sheetView.OnMouseMove(x, y));
    }

    sheetCanvas.addEventListener("touchmove", (touchEvent: TouchEvent) =>
    {
        touchEvent.preventDefault();
        ConvertToCanvasAndCall(touchEvent.touches[0].pageX, touchEvent.touches[0].pageY, (x: number, y: number) => sheetView.OnMouseMove(x, y));
    }, false);

    sheetCanvas.onmouseup = function(mouseEvent: MouseEvent)
    {
        ConvertToCanvasAndCall(mouseEvent.x, mouseEvent.y, (x: number, y: number) => sheetView.OnMouseUp(x, y));
    }

    sheetCanvas.addEventListener("touchend", (touchEvent: TouchEvent) =>
    {
        touchEvent.preventDefault();
        ConvertToCanvasAndCall(touchEvent.changedTouches[0].pageX, touchEvent.changedTouches[0].pageY, (x: number, y: number) => sheetView.OnMouseUp(x, y));
    }, false);

    function paintCanvas() {
        sheetCanvas.width = window.innerWidth;
        sheetCanvas.height = window.innerHeight;
        sheetView.Invalidate();
    }

    setInterval(function() { sheetView.Paint(); }, 30);

    paintCanvas();
};

function Export()
{
    var sheetCanvas = <HTMLCanvasElement>document.getElementById("mainSheet");

    sheetView.PrepareExport();

    window.location.href = sheetCanvas.toDataURL();
}

function ConvertToCanvasAndCall(x: number, y: number, func: (x:number, y:number) => void)
{
    var sheetCanvas = <HTMLCanvasElement>document.getElementById("mainSheet");
    var rect = sheetCanvas.getBoundingClientRect();

    func(x - rect.left, y - rect.top);
}