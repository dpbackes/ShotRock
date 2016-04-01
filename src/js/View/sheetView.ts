/// <reference path="arrowView.ts"/>
/// <reference path="stoneView.ts"/>
/// <reference path="../Helpers/PolarPoint.ts"/>
/// <reference path="../Helpers/CartesianPoint.ts"/>
/// <reference path="../Helpers/CoordinateSystems.ts"/>
/// <reference path="../ViewModel/sheetModel.ts"/>

module View
{
    export class SheetView
    {
        get HouseCenterX() : number
        {
            return this.canvasElement.width/2;
        }

        get HouseCenterY() : number
        {
            return this.canvasElement.height/4;
        }

        get HouseRadius() : number
        {
            return Math.min(this.canvasElement.width, this.canvasElement.height/2)/2 - 1;
        }

        get RenderingContext() : CanvasRenderingContext2D
        {
            return this.renderingContext;
        }

        get InsertMode() : InsertMode
        {
            return this.insertMode;
        }

        private canvasElement : HTMLCanvasElement;
        private sheetModel : ViewModel.SheetModel;
        private renderingContext : CanvasRenderingContext2D;
        private stones: View.StoneView[] = new Array<View.StoneView>();
        private arrows: View.ArrowView[] = new Array<View.ArrowView>();
        private currentArrow: View.ArrowView;
        private movingStone: ViewModel.StoneModel;
        private invalid: boolean;
        private mouseDown: boolean;
        private insertMode: InsertMode = InsertMode.RedRock;

        constructor(canvasElement: HTMLCanvasElement, sheetModel: ViewModel.SheetModel)
        {
            this.canvasElement = canvasElement;
            this.sheetModel = sheetModel;
            this.renderingContext = <CanvasRenderingContext2D>(canvasElement).getContext('2d');

            var self = this;
            sheetModel.SubscribeToStoneAdded(function(stone: ViewModel.StoneModel)
            {
                var stoneView = new View.StoneView(self, stone);
                self.stones.push(stoneView);

                if(self.insertMode === InsertMode.YellowRock)
                {
                    stoneView.ToggleColor();
                }

                self.invalid = true;
            });

            this.invalid = true;
        }

        OnMouseDown(x: number, y: number)
        {
            this.mouseDown = true;

            var foundStoneView = this.FindHitStone(x, y);

            if(!foundStoneView)
            {
                return;
            }

            this.movingStone = foundStoneView.Stone;
        }

        OnMouseMove(x: number, y: number)
        {
            if(!this.mouseDown)
            {
                return;
            }

            if(!this.movingStone)
            {
                if(this.currentArrow == null)
                {
                    this.currentArrow = new ArrowView(this.canvasElement);
                    this.arrows.push(this.currentArrow);
                }

                this.currentArrow.AddPoint(x, y);
                this.currentArrow.Paint();
                return;
            }

            this.movingStone.Place(this.ToSheetCoordinates(x, y));
        }

        OnMouseUp(x: number, y: number)
        {
            this.currentArrow = null;
            this.movingStone = null;

            this.mouseDown = false;

            var hitStone = this.FindHitStone(x, y);

            if(hitStone)
            {
                return;
            }

            if(this.insertMode === InsertMode.Arrow)
            {
                return;
            }

            this.sheetModel.AddStone(this.ToSheetCoordinates(x, y));
        }

        NextInsertMode() {
            switch (this.insertMode) {
                case InsertMode.RedRock:
                    this.insertMode = InsertMode.YellowRock;
                    return;
                case InsertMode.YellowRock:
                    this.insertMode = InsertMode.Arrow;
                    return;
                case InsertMode.Arrow:
                    this.insertMode = InsertMode.RedRock;
                    return;
            }
        }

        Paint()
        {
            if(!this.invalid && !this.movingStone)
            {
                return;
            }

            this.renderingContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

            this.DrawBorder();

            this.DrawRings();

            this.DrawTLine();

            this.DrawCenterLine();

            this.PaintStones();

            this.PaintArrows();

            this.invalid = false;
        }

        Invalidate()
        {
            this.invalid = true;

            var desiredWidth = this.HouseRadius * 2 + 100;

            if(this.canvasElement.width !== desiredWidth)
            {
                this.canvasElement.width = desiredWidth;
            }
        }

        PrepareExport()
        {
            this.renderingContext.font = "15px Arial";
            this.renderingContext.fillStyle = "blue";
            var text = "http://dpbackes.github.io/ShotRock";
            var textSize = this.renderingContext.measureText(text);
            this.renderingContext.fillText(text, this.canvasElement.width - textSize.width - 5, this.canvasElement.height - 5);
        }

        private FindHitStone(x: number, y: number) : View.StoneView
        {
            var foundStone = null;
            this.stones.some(stoneView => {
                if(stoneView.IsHit(x, y)){
                    foundStone = stoneView;
                    return true;
                }
            });

            return foundStone;
        }

        private ToSheetCoordinates(x: number, y: number) : Helpers.PolarPoint
        {
            x = x - this.HouseCenterX;
            y = y - this.HouseCenterY;

            var polarCoord = Helpers.CoordinateSystems.ToPolar(x, y);

            return new Helpers.PolarPoint(polarCoord.Angle, polarCoord.Radius/this.HouseRadius);
        }

        private DrawBorder()
        {
            this.renderingContext.fillStyle = "white";
            this.renderingContext.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            this.renderingContext.strokeRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        }

        private DrawRings()
        {
            var x = this.canvasElement.width/2;
            var y = this.canvasElement.height/4;

            this.PaintRing(x, y, this.HouseRadius, "blue");

            this.PaintRing(x, y, (8/12) * this.HouseRadius, "white");

            this.PaintRing(x, y, (4/12) * this.HouseRadius, "red");

            this.PaintRing(x, y, (1/12) * this.HouseRadius, "white");

            this.PaintStones();
        }

        private DrawTLine()
        {
            var y = this.canvasElement.height / 4;
            var width = this.canvasElement.width;

            this.renderingContext.beginPath();
            this.renderingContext.strokeStyle = "black";
            this.renderingContext.moveTo(0, y);
            this.renderingContext.lineTo(width, y);
            this.renderingContext.stroke();
            this.renderingContext.closePath();
        }

        private DrawCenterLine()
        {
            var x = this.canvasElement.width / 2;
            var height = this.canvasElement.height;

            this.renderingContext.beginPath();
            this.renderingContext.strokeStyle = "black";
            this.renderingContext.moveTo(x, 0);
            this.renderingContext.lineTo(x, height);
            this.renderingContext.stroke();
            this.renderingContext.closePath();
        }

        private PaintRing(x: number, y: number, radius: number, color: string)
        {
            this.renderingContext.beginPath();
            this.renderingContext.arc(x, y, radius, 0, 2*Math.PI);
            this.renderingContext.fillStyle = color;
            this.renderingContext.fill();
            this.renderingContext.closePath();
        }

        private PaintStones()
        {
            this.stones.forEach(stone => stone.Paint());
        }

        private PaintArrows()
        {
            this.arrows.forEach(arrow => arrow.Paint());
        }
    }

    export enum InsertMode
    {
        RedRock,
        YellowRock,
        Arrow
    }
}