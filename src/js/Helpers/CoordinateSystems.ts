/// <reference path="PolarPoint.ts"/>

module Helpers
{
	export class CoordinateSystems
	{
		static ToPolar(x: number, y: number) : Helpers.PolarPoint
		{
			return new Helpers.PolarPoint(Math.atan(y/x) + (x < 0 ? Math.PI : (y < 0 ? 2 * Math.PI : 0)), Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
		}

		static ToCartesian(polarPoint: Helpers.PolarPoint) : Helpers.CartesianPoint
		{
			return new Helpers.CartesianPoint(polarPoint.Radius*Math.cos(polarPoint.Angle), polarPoint.Radius*Math.sin(polarPoint.Angle));
		}
	}
}