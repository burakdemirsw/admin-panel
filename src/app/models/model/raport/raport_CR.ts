export class Raport_CR {
  raport_1?: Raport_1;
  raport_2?: Raport_2[];
  raport_3?: Raport_3[];
  raport_4?: Raport_4[];
}

export class Raport_1 {
  wsOrderCount?: number;
  wsOrderRevenue?: number;
  customerCount?: number;
  sendedEArchiveInvoicesCount?: number;
  unSendedEArchiveInvoicesCount?: number;
  sendedEInvoicesCount?: number;
  unSendedEInvoicesCount?: number;
  collectableRetailOrdersCount?: number;
  collectableWhosaleOrdersCount?: number;
}

export class Raport_2 {
  day?: string;
  orderCount?: number;
}

export class Raport_3 {
  day?: string;
  orderRevenue?: number;
}

export class Raport_4 {
  photoUrl?: string;
  product?: string;
  price?: number;
  saleCount?: number;
  revenue?: number;
}
