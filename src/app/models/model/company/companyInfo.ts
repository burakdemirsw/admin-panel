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
  photoFolderUrl?: string;
  googleDriveFolderId?: string;
}

export class CargoInfo {
  id: number;
  description: string;
  userName?: string;
  password?: string;
  customerCode?: string;
  apiKey?: string;
  apiSecret?: string;
}

export class DatabaseInfo extends BaseEntity {
  dataSource?: string;
  initialCatalog?: string;
  userId?: string;
  password?: string;
  trustServerCertificate?: boolean;
}

export class NebimInfo extends BaseEntity {
  description?: string;
  officeCode?: string;
  storeCode?: string;
  posTerminalID?: string;
  shipmentMethodCode?: string;
  deliveryCompanyCode?: string;
  basePriceCode: string;
  isOrderBase: boolean;
  isShipmentBase: boolean;
}

export class MarketPlaceInfo extends BaseEntity {
  description?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  baseUrl?: string;
  sellerId?: string;
  officeCode?: string;
  warehouseCode: string
  storeCode?: string;
  posTerminalID?: string;
  applicationCode?: string;
  shipmentMethodCode?: string;
  deliveryCompanyCode?: string;
  creditCardTypeCode?: string;
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
  smtpAddress: string;
  smtpPort: number
}
export class PaymentInfo {
  description?: string;
  merchantId: string;
  apiKey: string;
  apiSecretKey: string;
  okUrl: string;
  failUrl: string;
}

export class NebimUserInfo extends BaseEntity {
  description?: string;
  userGroupCode?: string;
  userName?: string;
  password?: string;
}

export class Info {
  companyInfos: CompanyInfo[];
  cargoInfos: CargoInfo[];
  databaseInfos: DatabaseInfo[];
  nebimInfos: NebimInfo[];
  marketPlaceInfos: MarketPlaceInfo[];
  reportInfos: ReportInfo[];
  mailInfos: MailInfo[];
  paymentInfos: PaymentInfo[];
}
export class MenuInfo {
  id?: number;
  label?: string;
  icon?: string;
  route?: string;
  action?: string;
  parentId?: number;
  isActive?: boolean;
}
export class MenuInfo_VM {
  id?: number;
  label?: string;
  icon?: string;
  route?: string;
  action?: string;
  parentId?: number;
  isActive?: boolean;
}
export class MenuItem {
  id: number;
  label?: string;  //asdasd
  icon?: string;
  route?: string;
  action?: string;
  children?: MenuItem[];
  isActive: boolean;
  permittedRoleIds?: number[]

}
export interface CargoCompanyInfo {
  id: number;
  companyName: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface MarketplaceCompanyInfo {
  id: number;
  companyName: string;
  createdDate: Date;
  updatedDate: Date;
}
export interface ProductPriceList_VM {
  code: string;
  description: Date;
}
export class InvoiceIntegratorInfo {
  id: number;
  description?: string;
  userName?: string;
  password?: string;
}
