import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import {
  CompanyInfo, CargoInfo, DatabaseInfo, NebimInfo, MarketPlaceInfo,
  ReportInfo, MailInfo, PaymentInfo, Info, NebimUserInfo, MenuItem, MenuInfo, CargoCompanyInfo, MarketplaceCompanyInfo,
  InvoiceIntegratorInfo,
  NebimInvoiceInfo
} from 'src/app/models/model/company/companyInfo';
import { bsBankTransTypeDesc, bsCashTransTypeDesc, bsCurrAccTypeDesc, CashAccount, cdColorDesc, cdCreditCardTypeDesc, cdCurrencyDesc, cdDebitReasonDesc, cdDeliveryCompanyDesc, cdItemDim1Desc, cdPOSTerminal, cdShipmentMethodDesc } from 'src/app/models/model/nebim/cdShipmentMethodDesc ';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { BankAccount } from "src/app/models/model/invoice/BankAccount";
import { cdPaymentDesc } from 'src/app/models/model/invoice/cdPaymentDesc';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }


  async getAllInfos(): Promise<any> {
    const response = await this.httpClientService.get<Info>({ controller: 'Infos/get-all-infos' }).toPromise();
    return response;
  }


  // CompanyInfo methods
  async addCompanyInfo(model: CompanyInfo): Promise<any> {
    const response = await this.httpClientService.post<CompanyInfo>({ controller: 'Infos/add-company-info' }, model).toPromise();
    return response;
  }

  async updateCompanyInfo(model: CompanyInfo): Promise<any> {
    const response = await this.httpClientService.post<CompanyInfo>({ controller: 'Infos/update-company-info' }, model).toPromise();
    return response;
  }

  async deleteCompanyInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-company-info/${id}` }).toPromise();
    return response;
  }

  async getCompanyInfos(): Promise<any> {
    const response = await this.httpClientService.get<CompanyInfo[]>({ controller: 'Infos/get-company-infos' }).toPromise();
    return response;
  }

  // CargoInfo methods
  async addCargoInfo(model: CargoInfo): Promise<any> {
    const response = await this.httpClientService.post<CargoInfo>({ controller: 'Infos/add-cargo-info' }, model).toPromise();
    return response;
  }

  async updateCargoInfo(model: CargoInfo): Promise<any> {
    const response = await this.httpClientService.post<CargoInfo>({ controller: 'Infos/update-cargo-info' }, model).toPromise();
    return response;
  }

  async deleteCargoInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-cargo-info/${id}` }).toPromise();
    return response;
  }

  async getCargoInfos(): Promise<any> {
    const response = await this.httpClientService.get<CargoInfo[]>({ controller: 'Infos/get-cargo-infos' }).toPromise();
    return response;
  }

  // DatabaseInfo methods
  async addDatabaseInfo(model: DatabaseInfo): Promise<any> {
    const response = await this.httpClientService.post<DatabaseInfo>({ controller: 'Infos/add-database-info' }, model).toPromise();
    return response;
  }

  async updateDatabaseInfo(model: DatabaseInfo): Promise<any> {
    const response = await this.httpClientService.post<DatabaseInfo>({ controller: 'Infos/update-database-info' }, model).toPromise();
    return response;
  }

  async deleteDatabaseInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-database-info/${id}` }).toPromise();
    return response;
  }

  async getDatabaseInfos(): Promise<any> {
    const response = await this.httpClientService.get<DatabaseInfo[]>({ controller: 'Infos/get-database-infos' }).toPromise();
    return response;
  }

  // NebimInfo methods
  async addNebimInfo(model: NebimInfo): Promise<any> {
    const response = await this.httpClientService.post<NebimInfo>({ controller: 'Infos/add-nebim-info' }, model).toPromise();
    return response;
  }

  async updateNebimInfo(model: NebimInfo): Promise<any> {
    const response = await this.httpClientService.post<NebimInfo>({ controller: 'Infos/update-nebim-info' }, model).toPromise();
    return response;
  }

  async deleteNebimInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-nebim-info/${id}` }).toPromise();
    return response;
  }

  async getNebimInfos(): Promise<any> {
    const response = await this.httpClientService.get<NebimInfo[]>({ controller: 'Infos/get-nebim-infos' }).toPromise();
    return response;
  }



  async addNebimUserInfo(model: NebimUserInfo): Promise<any> {
    const response = await this.httpClientService.post<NebimUserInfo>({ controller: 'Infos/add-nebim-user-info' }, model).toPromise();
    return response;
  }

  async updateNebimUserInfo(model: NebimUserInfo): Promise<any> {
    const response = await this.httpClientService.post<NebimUserInfo>({ controller: 'Infos/update-nebim-user-info' }, model).toPromise();
    return response;
  }

  async deleteNebimUserInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-nebim-user-info/${id}` }).toPromise();
    return response;
  }

  async getNebimUserInfos(): Promise<any> {
    const response = await this.httpClientService.get<NebimUserInfo[]>({ controller: 'Infos/get-nebim-user-infos' }).toPromise();
    return response;
  }

  // MarketPlaceInfo methods
  async addMarketPlaceInfo(model: MarketPlaceInfo): Promise<any> {
    const response = await this.httpClientService.post<MarketPlaceInfo>({ controller: 'Infos/add-marketplace-info' }, model).toPromise();
    return response;
  }

  async updateMarketPlaceInfo(model: MarketPlaceInfo): Promise<any> {
    const response = await this.httpClientService.post<MarketPlaceInfo>({ controller: 'Infos/update-marketplace-info' }, model).toPromise();
    return response;
  }

  async deleteMarketPlaceInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-marketplace-info/${id}` }).toPromise();
    return response;
  }

  async getMarketPlaceInfos(): Promise<any> {
    const response = await this.httpClientService.get<MarketPlaceInfo[]>({ controller: 'Infos/get-marketplace-infos' }).toPromise();
    return response;
  }

  // ReportInfo methods
  async addReportInfo(model: ReportInfo): Promise<any> {
    const response = await this.httpClientService.post<ReportInfo>({ controller: 'Infos/add-report-info' }, model).toPromise();
    return response;
  }

  async updateReportInfo(model: ReportInfo): Promise<any> {
    const response = await this.httpClientService.post<ReportInfo>({ controller: 'Infos/update-report-info' }, model).toPromise();
    return response;
  }

  async deleteReportInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-report-info/${id}` }).toPromise();
    return response;
  }

  async getReportInfos(): Promise<any> {
    const response = await this.httpClientService.get<ReportInfo[]>({ controller: 'Infos/get-report-infos' }).toPromise();
    return response;
  }

  // MailInfo methods
  async addMailInfo(model: MailInfo): Promise<any> {
    const response = await this.httpClientService.post<MailInfo>({ controller: 'Infos/add-mail-info' }, model).toPromise();
    return response;
  }

  async updateMailInfo(model: MailInfo): Promise<any> {
    const response = await this.httpClientService.post<MailInfo>({ controller: 'Infos/update-mail-info' }, model).toPromise();
    return response;
  }

  async deleteMailInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-mail-info/${id}` }).toPromise();
    return response;
  }

  async getMailInfos(): Promise<any> {
    const response = await this.httpClientService.get<MailInfo[]>({ controller: 'Infos/get-mail-infos' }).toPromise();
    return response;
  }

  async addPaymentInfo(model: PaymentInfo): Promise<any> {
    const response = await this.httpClientService.post<PaymentInfo>({ controller: 'Infos/add-payment-info' }, model).toPromise();
    return response;
  }

  async updatePaymentInfo(model: PaymentInfo): Promise<any> {
    const response = await this.httpClientService.post<PaymentInfo>({ controller: 'Infos/update-payment-info' }, model).toPromise();
    return response;
  }

  async deletePaymentInfo(merchantId: string): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-payment-info/${merchantId}` }).toPromise();
    return response;
  }

  async getPaymentInfos(): Promise<any> {
    const response = await this.httpClientService.get<PaymentInfo[]>({ controller: 'Infos/get-payment-infos' }).toPromise();
    return response;
  }


  async getStructuredMenu(userId: number): Promise<MenuItem[]> {
    const response: MenuItem[] = await this.httpClientService.get<MenuItem>({ controller: 'Users/get-structured-menu' }, userId.toString()).toPromise();
    return response;
  }

  // MenuInfo methods
  async addMenuInfo(model: MenuInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/add-menu-info' }, model).toPromise();
    return response;
  }

  async updateMenuInfo(model: MenuInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/update-menu-info' }, model).toPromise();
    return response;
  }

  async deleteMenuInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-menu-info/${id}` }).toPromise();
    return response;
  }

  async getMenuInfos(filter: boolean, isActive?: boolean): Promise<any> {
    const response: MenuInfo[] = await this.httpClientService.get_new<MenuInfo[]>({ controller: 'Infos/get-menu-infos' }).toPromise();
    if (filter) {
      const _response = response.filter(p => p.isActive == isActive);
      return _response;
    }
    return response;
  }

  //-----
  async addCargoCompanyInfo(model: CargoCompanyInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/add-cargo-company' }, model).toPromise();
    return response;
  }

  async updateCargoCompanyInfo(model: CargoCompanyInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/update-cargo-company' }, model).toPromise();
    return response;
  }

  async deleteCargoCompanyInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-cargo-company/${id}` }).toPromise();
    return response;
  }

  async getCargoCompanyInfos(): Promise<any> {
    const response: CargoCompanyInfo[] = await this.httpClientService.get_new<CargoCompanyInfo[]>({ controller: 'Infos/get-cargo-companies' }).toPromise();
    return response;
  }

  //-----
  async addMarketPlaceCompanyInfo(model: MarketplaceCompanyInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/add-marketplace-company' }, model).toPromise();
    return response;
  }

  async updateMarketPlaceCompanyInfo(model: MarketplaceCompanyInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/update-marketplace-company' }, model).toPromise();
    return response;
  }

  async deleteMarketPlaceCompanyInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-marketplace-company/${id}` }).toPromise();
    return response;
  }

  async getMarketPlaceCompanyInfos(filter: boolean, isActive?: boolean): Promise<any> {
    const response: MarketplaceCompanyInfo[] = await this.httpClientService.get_new<MarketplaceCompanyInfo[]>({ controller: 'Infos/get-marketplace-companies' }).toPromise();
    return response;
  }

  //----


  // InvoiceIntegratorInfo methods
  async addInvoiceEntegratorInfo(model: InvoiceIntegratorInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/add-invoice-integrator-info' }, model).toPromise();
    return response;
  }

  async updateInvoiceEntegratorInfo(model: InvoiceIntegratorInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/update-invoice-integrator-info' }, model).toPromise();
    return response;
  }

  async deleteInvoiceEntegratorInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-invoice-integrator-info/${id}` }).toPromise();
    return response;
  }

  async getInvoiceEntegratorInfos(): Promise<any> {
    const response: InvoiceIntegratorInfo[] = await this.httpClientService.get_new<InvoiceIntegratorInfo[]>({ controller: 'Infos/get-invoice-integrator-infos' }).toPromise();
    return response;
  }
  //---------

  // Add NebimInvoiceInfo
  async addNebimInvoiceInfo(model: NebimInvoiceInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/add-nebim-invoice-info' }, model).toPromise();
    return response;
  }

  // Update NebimInvoiceInfo
  async updateNebimInvoiceInfo(model: NebimInvoiceInfo): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'Infos/update-nebim-invoice-info' }, model).toPromise();
    return response;
  }

  // Delete NebimInvoiceInfo by id
  async deleteNebimInvoiceInfo(id: number): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: `Infos/delete-nebim-invoice-info/${id}` }).toPromise();
    return response;
  }

  // Get all NebimInvoiceInfos
  async getNebimInvoiceInfos(): Promise<any> {
    const response = await this.httpClientService.get<NebimInvoiceInfo[]>({ controller: 'Infos/get-nebim-invoice-infos' }).toPromise();
    return response;
  }

  // Get NebimInvoiceInfo by id
  async getNebimInvoiceInfoById(id: number): Promise<any> {
    const response = await this.httpClientService.get<NebimInvoiceInfo>({ controller: `Infos/get-nebim-invoice-info/${id}` }).toPromise();
    return response;
  }
  //--------------
  async sendTestMail(request: any): Promise<any> {
    const response = await this.httpClientService.post<any>({ controller: 'direct-request/send-mail' }, request).toPromise();
    return response;
  }
  async getProductPriceList(): Promise<any> {
    const response = await this.httpClientService.get<any>({ controller: 'Infos/get-product-price-list' }).toPromise();
    return response;
  }

  async getShipmentMethods(): Promise<cdShipmentMethodDesc[]> {
    const response = await this.httpClientService.get<cdShipmentMethodDesc>({ controller: 'Infos/get-shipment-methods' }).toPromise();
    return response;
  }

  async getDeliveryCompanies(): Promise<cdDeliveryCompanyDesc[]> {
    const response = await this.httpClientService.get<cdDeliveryCompanyDesc>({ controller: 'Infos/get-delivery-companies' }).toPromise();
    return response;
  }

  async getColors(): Promise<cdColorDesc[]> {
    const response = await this.httpClientService.get<cdColorDesc>({ controller: 'Infos/get-colors' }).toPromise();
    return response;
  }

  async getItemDimensions(): Promise<cdItemDim1Desc[]> {
    const response = await this.httpClientService.get<cdItemDim1Desc>({ controller: 'Infos/get-item-dimensions' }).toPromise();
    return response;
  }

  async getCreditCardTypes(): Promise<cdCreditCardTypeDesc[]> {
    const response = await this.httpClientService.get<cdCreditCardTypeDesc>({ controller: 'Infos/get-credit-card-types' }).toPromise();
    return response;
  }

  async getCurrencyDesc(): Promise<cdCurrencyDesc[]> {
    const response = await this.httpClientService.get<cdCurrencyDesc>({ controller: 'Infos/get-currency-desc' }).toPromise();
    return response;
  }
  async getPosTerminals(): Promise<cdPOSTerminal[]> {
    const response = await this.httpClientService.get<cdPOSTerminal>({ controller: 'Infos/get-pos-terminals' }).toPromise();
    return response;
  }

  //
  async getCashTransTypeDesc(): Promise<bsCashTransTypeDesc[]> {
    const response = await this.httpClientService.get<bsCashTransTypeDesc>({ controller: 'Infos/get-cash-trans-type-desc' }).toPromise();
    return response;
  }
  async getBankTransTypeDesc(): Promise<bsBankTransTypeDesc[]> {
    const response = await this.httpClientService.get<bsBankTransTypeDesc>({ controller: 'Infos/get-bank-trans-type-desc' }).toPromise();
    return response;
  }

  async getDebitReasonDesc(): Promise<cdDebitReasonDesc[]> {
    const response = await this.httpClientService.get<cdDebitReasonDesc>({ controller: 'Infos/get-debit-reason-desc' }).toPromise();
    return response;
  }
  async getCurrAccTypeDesc(): Promise<bsCurrAccTypeDesc[]> {
    const response = await this.httpClientService.get<bsCurrAccTypeDesc>({ controller: 'Infos/get-curr-acc-type-desc' }).toPromise();
    return response;
  }

  async getCashAccounts(): Promise<CashAccount[]> {
    const response = await this.httpClientService.get<CashAccount>({ controller: 'Infos/get-cash-accounts' }).toPromise();
    return response;
  }
  async getBankAccounts(): Promise<BankAccount[]> {
    const response = await this.httpClientService.get<BankAccount>({ controller: 'Infos/get-bank-accounts' }).toPromise();
    return response;
  }

  async getPaymentDesc(): Promise<cdPaymentDesc[]> {
    const response = await this.httpClientService.get<cdPaymentDesc>({ controller: 'Infos/get-payment-types' }).toPromise();
    return response;
  }
  async getWarehouseAndOffices(): Promise<WarehouseOfficeModel[]> {
    try {
      const data = await this.httpClientService
        .get<WarehouseOfficeModel>({
          controller: 'Infos/get-office-and-warehouses',
        })
        .toPromise();
      return data;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
}

