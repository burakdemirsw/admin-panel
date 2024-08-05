import { BaseEntity } from "../../entity/baseEntity";

export class CompanyInfo extends BaseEntity {
  companyName?: string;
  logoUrl?: string;
  serviceSector?: string;
  authorizedPerson?: string;
  phone?: string;
  fax?: string;
  taxOffice?: string;
  taxNumber?: string;
  tradeRegistryNo?: string;
  mersisNo?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  companyCountry?: string;
  companyCity?: string;
  companyDistrict?: string;
  passwordResetUrl?: string;
  webSiteUrl?: string;
  printerName1?: string;
  printerName2?: string;
  documentsFolderPath?: string;
  invoiceFolderPath?: string;
  nebimUrl?: string;
}

export class CargoInfo extends BaseEntity {
  userName?: string;
  password?: string;
  attribute1?: string;
  attribute2?: string;
  attribute3?: string;
}

export class DatabaseInfo extends BaseEntity {
  dataSource?: string;
  initialCatalog?: string;
  userId?: string;
  password?: string;
  trustServerCertificate?: boolean;
}

export class NebimInfo extends BaseEntity {
  type?: string;
  officeCode?: string;
  storeCode?: string;
  posTerminalId?: string;
  shipmentMethodCode?: string;
  deliveryCompanyCode?: string;
}

export class MarketPlaceInfo extends BaseEntity {
  description?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  baseUrl?: string;
  sellerId?: string;
}

export class ReportInfo extends BaseEntity {
  description?: string;
  filePath?: string;
}

export class MailInfo extends BaseEntity {
  isFirst: boolean;
  userName?: string;
  password?: string;
  applicationPassword?: string;
}
