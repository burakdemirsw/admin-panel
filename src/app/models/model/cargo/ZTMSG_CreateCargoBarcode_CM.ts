export class ZTMSG_CreateCargoBarcode_CM {
  orderNumber: string;
  cargoFirmId: number;
}


export class ZTMSG_CreateCargoBarcode_RM<T> extends ZTMSG_CreateCargoBarcode_CM {
  Status?: boolean;
  Response!: T;
}