export class FailedTransaction {
  id?: number; // Optional property (could be nullable)
  createdDate?: Date; // Optional property (could be nullable)
  updatedDate?: Date; // Optional property (could be nullable)
  transactionDescription?: string;
  status?: boolean;
  operationNumber?: string;
  errMsg?: string;
}
