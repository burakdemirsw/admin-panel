

export class ProposalLineDetail {
    id: string; // Guid
    lineId: string; // LineId
    requestedShipmentQuantity?: number; // ConfirmedQuantity
    confirmedShipmentQuantity?: number;
    // warehouseCode: string
    userId: number;
    createdDate?: Date; // CreatedDate
    updatedDate?: Date; // UpdatedDate
}
