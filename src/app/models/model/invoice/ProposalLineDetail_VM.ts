
export class ProposalLineDetail_VM {
    id: string; // Guid
    lineId: string; // LineId
    requestedShipmentQuantity?: number; // ConfirmedQuantity
    confirmedShipmentQuantity?: number; // ConfirmedQuantity

    // warehouseCode: string;
    userId: number;
    barcode: string;
    itemCode: string;
    createdDate?: Date; // CreatedDate
    updatedDate?: Date; // UpdatedDate
}
