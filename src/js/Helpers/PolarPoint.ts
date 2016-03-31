module Helpers 
{
	export class PolarPoint
	{
		get Angle() : number
		{
			return this.angle;
		}

		get Radius() : number
		{
			return this.radius;
		}

		private angle: number;
		private radius: number;
		
		constructor(angle: number, radius: number) 
		{
			this.angle = angle;
			this.radius = radius;
		}
	}
}