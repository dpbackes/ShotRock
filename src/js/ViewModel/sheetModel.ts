/// <reference path="./stoneModel.ts"/>

module ViewModel
{
	export class SheetModel
	{
		private stoneAddedHandlers: { (stone: ViewModel.StoneModel): void; }[] = [];
		private stones: ViewModel.StoneModel[] = new Array<ViewModel.StoneModel>();

		AddStone(location: Helpers.PolarPoint)
		{
			var newStone = new ViewModel.StoneModel(location);
			this.stones.push(newStone);
			this.NotifyStoneAdded(newStone);
		}

		SubscribeToStoneAdded(value : { (stone: ViewModel.StoneModel): void; })
		{
			this.stoneAddedHandlers.push(value);
		}
		
		UnsubscribeFromStoneAdded(value : { (stone: ViewModel.StoneModel): void })
		{
			this.stoneAddedHandlers = this.stoneAddedHandlers.filter(handler => handler !== value);
		}

		private NotifyStoneAdded(stone: ViewModel.StoneModel)
		{
			if (this.stoneAddedHandlers)
			{
				this.stoneAddedHandlers.slice(0).forEach(handler => handler(stone));
			}
		}
	}
}