

export class OrderLineDetail {
    id: string; // Guid
    lineId: string; // LineId
    requestedShipmentQuantity?: number; // ConfirmedQuantity
    warehouseCode: string;
    userId: number;
    createdDate?: Date; // CreatedDate
    updatedDate?: Date; // UpdatedDate
}
