
export class OrderLineDetail_VM {
  id: string; // Guid
  lineId: string; // LineId
  requestedShipmentQuantity?: number; // ConfirmedQuantity
  warehouseCode: string;
  userId: number;
  barcode: string;
  itemCode: string;
  createdDate?: Date; // CreatedDate
  updatedDate?: Date; // UpdatedDate
}


