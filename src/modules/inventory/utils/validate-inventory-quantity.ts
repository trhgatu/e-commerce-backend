import { IInventory } from '../inventory.model';

export function validateInventoryQuantity(
  quantity: number,
  inventory: Partial<IInventory>
) {
  if (inventory.maxQuantity !== undefined && quantity > inventory.maxQuantity) {
    throw new Error(
      `Quantity (${quantity}) exceeds maxQuantity (${inventory.maxQuantity})`
    );
  }

  if (inventory.minQuantity !== undefined && quantity < inventory.minQuantity) {
    throw new Error(
      `Quantity (${quantity}) is below minQuantity (${inventory.minQuantity})`
    );
  }
}
