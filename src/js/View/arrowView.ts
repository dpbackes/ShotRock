/// <reference path="../Helpers/CartesianPoint.ts"/>

module View
{
    export class ArrowView
    {
        private points : Helpers.CartesianPoint[] = new Array<Helpers.CartesianPoint>();

        private renderingContext : CanvasRenderingContext2D;

        constructor(canvasElement: HTMLCanvasElement)
        {
            this.renderingContext = <CanvasRenderingContext2D>(canvasElement).getContext('2d');
        }

        AddPoint(x: number, y: number)
        {
            this.points.push(new Helpers.CartesianPoint(x, y));
        }

        Paint()
        {
            if(this.points.length < 2)
            {
                return;
            }

            var originalLine = this.renderingContext.lineWidth;

            this.renderingContext.beginPath();

            this.renderingContext.strokeStyle = "orange";
            this.renderingContext.lineWidth = 2;

            this.renderingContext.moveTo(this.points[0].X, this.points[0].Y);

            var self = this;
            this.points.forEach(point => {
                self.renderingContext.lineTo(point.X, point.Y);
            });

            this.renderingContext.stroke();

            this.renderingContext.lineWidth = originalLine;
        }
    }
}