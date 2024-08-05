import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { CompanyInfo, CargoInfo, DatabaseInfo, NebimInfo, MarketPlaceInfo, ReportInfo, MailInfo, PaymentInfo, Info } from 'src/app/models/model/company/companyInfo';

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


}
