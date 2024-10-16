import { Injectable, model } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LogFilterModel } from 'src/app/models/model/log/logFilterModel ';
import { Raport_BestSeller, Raport_ProductExtract, Raport_ProductInventory } from 'src/app/models/model/raport/raport_CR';
import { bsQueryMaster, bsQueryMasterVm, bsQueryParams, GetFinalQueryRequest } from 'src/app/models/model/raport/bsQueryMaster ';
import { ClientUrls } from 'src/app/models/const/ClientUrls';

@Injectable({
  providedIn: 'root'
})
export class RaportService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  async getRaports(day: number): Promise<any> {
    try {
      const response = this.httpClientService
        .get<any>({
          controller: 'raports/get-raports',
        }, day.toString())
        .toPromise();
      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }


  async getProductInventoryRaport(itemCode: string): Promise<Raport_ProductInventory[]> {
    const response = await this.httpClientService.get<Raport_ProductInventory>({ controller: "Raports/get-product-inventory-raport" }, itemCode).toPromise()
    return response;

  }


  async getProductExtractQuantity(itemCode: string): Promise<Raport_ProductExtract[]> {
    const response = await this.httpClientService.get<Raport_ProductExtract>({ controller: "Raports/get-product-extract-quantity" }, itemCode).toPromise()
    return response;

  }

  async getBestSellers(): Promise<Raport_BestSeller[]> {
    const response = await this.httpClientService.get<Raport_BestSeller>({ controller: "Raports/get-best-sellers" }).toPromise()
    return response;

  }


  async getAllNebimRaports(): Promise<bsQueryMaster[]> {
    const response = await this.httpClientService.get<bsQueryMaster>({ controller: "Raports/get-all-nebim-raports" }).toPromise()
    return response;

  }

  async getAllNebimRaports_VM(): Promise<bsQueryMasterVm[]> {
    const response = await this.httpClientService.get<bsQueryMasterVm>({ controller: "Raports/get-all-nebim-raports-vm" }).toPromise()
    return response;

  }

  async getRaportByQueryId(id: string): Promise<bsQueryParams[]> {
    const response = await this.httpClientService.get<bsQueryParams>({ controller: "Raports/get-raport-by-query-id" }, id).toPromise()
    return response;
  }

  async getFinalRaportQuery(req: GetFinalQueryRequest): Promise<any[]> {
    const response = await this.httpClientService.post<GetFinalQueryRequest>({ controller: "Raports/get-final-raport-query" }, req).toPromise()
    return response;
  }

  async sendInvoiceToPrinter(request: string): Promise<any> {
    try {
      // if (window.confirm("Faturayı yazdırmak istediğinize emin misiniz?")) {

      // }
      var userId = localStorage.getItem('userId')
      var response = await this.httpClientService.get<string>({ controller: "raports/send-invoice-to-printer" + "/" + request + "/" + userId }).toPromise();

      return response;

    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  async createPdf(request: string): Promise<any> {
    try {
      var userId = localStorage.getItem('userId')

      this.httpClient.get(ClientUrls.baseUrl + '/raports/get-recepie-pdf/' + request + "/" + userId, { responseType: 'arraybuffer' })
        .subscribe((data: ArrayBuffer) => {
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);

          // Open the PDF in a new tab/window
          const newWindow = window.open(fileURL);

          // Wait for a brief moment before printing (optional)
          setTimeout(() => {
            newWindow?.print();
          }, 1000);
        });

      return true;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  async getWayBillReport(request: string[]): Promise<any> {
    try {
      var userId = localStorage.getItem('userId')

      this.httpClient.post(ClientUrls.baseUrl + '/raports/get-waybill-report', request, { responseType: 'arraybuffer' })
        .subscribe((data: ArrayBuffer) => {
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);

          // Open the PDF in a new tab/window
          const newWindow = window.open(fileURL);

          // Wait for a brief moment before printing (optional)
          setTimeout(() => {
            newWindow?.print();
          }, 1000);
        });

      return true;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

}
