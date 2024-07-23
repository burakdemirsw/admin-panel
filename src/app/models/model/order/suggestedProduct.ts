export class SuggestedProduct {
  itemCode: string;
  suggestedItemCode: string;
  suggestedItemInventory: number;
  priority: number;

  constructor(itemCode: string, suggestedItemCode: string, suggestedItemInventory: number, priority: number) {
    this.itemCode = itemCode;
    this.suggestedItemCode = suggestedItemCode;
    this.suggestedItemInventory = suggestedItemInventory;
    this.priority = priority;
  }
}
