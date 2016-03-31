/// <reference path="../Helpers/PolarPoint.ts"/>

module ViewModel
{
	export class StoneModel
	{
		get Position(): Helpers.PolarPoint
		{
			return this.point;
		}

		private point: Helpers.PolarPoint;

		constructor(point: Helpers.PolarPoint) 
		{
			this.Place(point);
		}

		Place(point: Helpers.PolarPoint){
			this.point = point;
		}
	}
}