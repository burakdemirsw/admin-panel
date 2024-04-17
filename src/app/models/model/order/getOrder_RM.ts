export class GetNebimOrders_RM {
  startDate: Date;
  endDate: Date;
  shipmentStatus: string;
  warehouseCode: string;
  itemCode: string;

  constructor() {
    this.startDate = null;
    this.endDate = null;
    this.shipmentStatus = null;
    this.warehouseCode = null;
    this.itemCode = null;
  }
}
export class GetNebimOrders {
  companyName: string;
  itemCode: string;
  colorDescription: string;
  remainingOrderQuantity: number;
}
