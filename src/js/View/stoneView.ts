module View
{
	export class StoneView
	{     
		get Stone() : ViewModel.StoneModel
		{
			return this.stone;
		}

		private get PositionOnCanvas() : Helpers.CartesianPoint
		{
			var point = Helpers.CoordinateSystems.ToCartesian(new Helpers.PolarPoint(this.stone.Position.Angle, this.stone.Position.Radius*this.sheet.HouseRadius));			

			return new Helpers.CartesianPoint(point.X + this.sheet.HouseCenterX, point.Y + this.sheet.HouseCenterY)
		}
		
		private get PaintedRadius() : number
		{
			return (1/12) * this.sheet.HouseRadius;
		}
		
		private sheet: View.SheetView;
		private stone: ViewModel.StoneModel;
		private color: string;
        private strokeColor: string;

		constructor(sheet: View.SheetView, stone: ViewModel.StoneModel) 
		{
			this.sheet = sheet;
			this.stone = stone;
			this.color = "red";
            this.strokeColor = "black";
		}

		Paint()
		{
            var originalLine = this.sheet.RenderingContext.lineWidth;
            
			this.sheet.RenderingContext.beginPath();
			this.sheet.RenderingContext.fillStyle = this.color;
            this.sheet.RenderingContext.strokeStyle = this.strokeColor;
            this.sheet.RenderingContext.lineWidth = 2;
			this.sheet.RenderingContext.arc(this.PositionOnCanvas.X, this.PositionOnCanvas.Y, this.PaintedRadius, 0, 2 * Math.PI);
			this.sheet.RenderingContext.fill();
			this.sheet.RenderingContext.stroke();
			this.sheet.RenderingContext.closePath();
            
            this.sheet.RenderingContext.lineWidth = originalLine;          
		}
		
		ToggleColor()
		{
			if(this.color === "red")
			{
				this.color = "yellow";
				return;
			}

			this.color = "red";
		}
		
		IsHit(x: number, y:number) : boolean
		{
			var centeredX = x - this.PositionOnCanvas.X;
			var centeredY = y - this.PositionOnCanvas.Y;
			
			return centeredX * centeredX + centeredY * centeredY < Math.pow(this.PaintedRadius, 2);
		}
	}
}