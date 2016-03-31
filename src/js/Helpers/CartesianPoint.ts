module Helpers 
{
	export class CartesianPoint
	{
		get X() : number
		{
			return this.x;
		}

		get Y() : number
		{
			return this.y;
		}

		private x: number;
		private y: number;
		
		constructor(x: number, y: number) 
		{
			this.x = x;
			this.y = y;
		}
	}
}