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
