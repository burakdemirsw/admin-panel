export class SuggestedProduct {
  photoUrl: string
  itemCode: string;
  suggestedItemCode: string;
  suggestedItemInventory: number;
  suggestedItemDesc: string;
  priority: number;
  brand?: string;
  speed: number;
  inventory: number;
  quantity: number;
  tsfFiyat: number;
  // constructor(
  //   itemCode: string,
  //   suggestedItemCode: string,
  //   suggestedItemInventory: number,
  //   priority: number,
  //   brand?: string,
  //   speed: number = 0,
  //   inventory: number = 0,
  //   quantity: number = 0,
  //   tsfFiyat: number = 0
  // ) {
  //   this.itemCode = itemCode;
  //   this.suggestedItemCode = suggestedItemCode;
  //   this.suggestedItemInventory = suggestedItemInventory;
  //   this.priority = priority;
  //   this.brand = brand;
  //   this.speed = speed;
  //   this.inventory = inventory;
  //   this.quantity = quantity;
  //   this.tsfFiyat = tsfFiyat;
  // }
}
