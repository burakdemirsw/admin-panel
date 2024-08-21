export class ZTMSG_ProposalProduct {
  id: number;
  proposalId: number; // Guid türü TypeScript'te string olarak temsil edilir
  photoUrl?: string;
  barcode?: string;
  itemCode?: string;
  quantity: number;
  brand?: string;
  inventory: number;
  price?: number;
  discountedPrice?: number;
  description?: string;
  discountRate1: number;
  discountRate2: number;
  // discountRate3: number;
  // discountRate4: number;
  totalPrice: number;
  taxRate: number;
  totalTaxedPrice: number;


}

export class ZTMSG_Proposal {
  id: number;
  discountRate1?: number; // Optional property
  discountRate2?: number; // Optional property
  userId: number;
  createdDate?: Date; // Optional property
  updatedDate?: Date; // Optional property
  currAccDescription: string
  currAccCode: string

  constructor() {
    this.discountRate1 = 0;
    this.discountRate2 = 0;
  }
}
export class Proposal_VM {
  id: number;
  count: number;
  count2: number;
  createdDate: Date;
  user: string;
}
