export interface bsQueryMasterVm {
  queryID: string;
  description: string;
}

export interface bsQueryMaster {
  queryID: string;
  programName: string;
  visibleName: string;
  sortOrder: number;
  queryTypeCode: number;
  description: string;
  viewTypeCode: number;
  v3ReportFileName: string;
  pivotFileName: string;
  gridFileName: string;
  defaultFilterCols: string;
  parameteredFields: string;
  notBeFilteredFields: string;
  canReportOtherCompanies: boolean;
  masterDataTableQuery: string;
  isUnchangeable: boolean;
  fromReportServer: boolean;
  advancedQueryOption: string;
  dateColumnNamesMinMaxValueNotControl: string;
}

export interface bsQueryParams {
  description: string;
  value?: string; // Optional property
  type: string;
  isMust: boolean;
}

export interface GetFinalQueryRequest {
  params: bsQueryParams[];
  id: string;
}
export class AssurSaleReport {
  saleReports: SaleReport[];
  stockReports: StockReport[];
  financialReports: FinancialReport[];
  accountReports: AccountReport[];
  inventoryReports: InventoryReport[];
}

export interface SaleReport {
  date: Date;
  dueDate: Date;
  invoice_No: string;
  invoice_Type: string;
  total_Amount: number;
  total_VAT: number;
  customer_Code: string;
  customer_Name: string;
}

export interface StockReport {
  stock_Code: string;
  stock_Name: string;
  unit: string;
  quantity: number;
  price: number;
  subtotal: number;
  total_With_VAT: number;
}

export interface FinancialReport {
  process: string;
  totalAmount: number;
  total_VAT: number;
  total_Discount: number;
}

export interface AccountReport {
  responsible: string;
  debit_Amount: number;
  credit_Amount: number;
}

export interface InventoryReport {
  stock_Code: string;
  stock_Name: string;
  incoming_Quantity: number;
  outgoing_Quantity: number;  //aslkdjsalşkdj
  remaining_Quantity: number;
}
export class TillReport {
  cashCode: string;
  cashName: string;
  documentNumber: string;
  description: string;
  income: number;
  expense: number;
  accountCode: string;
  tradeTitle: string;
}
export class BankReport {
  cashCode: string;
  cashName: string;
  accountType: string;
  totalDebit: number;
  totalCredit: number;
  totalBalance: string; // Adjust type as necessary
  pendingPosPayments: number;
  availableBalance: number;
}
