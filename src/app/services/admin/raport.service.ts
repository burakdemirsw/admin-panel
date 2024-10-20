import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { AssurSaleReport, BankReport, bsQueryMaster, bsQueryMasterVm, bsQueryParams, GetFinalQueryRequest, TillReport } from 'src/app/models/model/raport/bsQueryMaster ';
import { Raport_BestSeller, Raport_ProductExtract, Raport_ProductInventory } from 'src/app/models/model/raport/raport_CR';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';

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
  async createProposalReport(request: string): Promise<any> {
    try {
      var response: any = await this.httpClientService.get<any>({
        controller: "Raports/create-proposal-report", responseType: 'arraybuffer'
      }, request.toString()).toPromise();
      if (response) {
        this.openPdf(response);
      } else {
        this.toasterService.error("Hata Alındı ")
      }
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async openPdf(response) {

    const file = new Blob([response], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Create a temporary link element
    const downloadLink = document.createElement('a');
    downloadLink.href = fileURL;
    downloadLink.download = "Raport-" + Date.now.toString();  // Set the filename for the download
    document.body.appendChild(downloadLink); // Append to body
    downloadLink.click();  // Trigger the download
    document.body.removeChild(downloadLink); // Remove the link after triggering the download
    URL.revokeObjectURL(fileURL); // Clean up the URL object



    const _file = new Blob([response], { type: 'application/pdf' });
    const _fileURL = URL.createObjectURL(_file);

    // Create an iframe element
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';  // Hide the iframe
    iframe.src = _fileURL;

    // Append the iframe to the body
    document.body.appendChild(iframe);

    // Wait until the iframe is loaded, then call print
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };

  }
  async createCollectedProductsOfOrderRaport(request: string, warehouseCode: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({
        controller: "raports/create-collected-order-products-raports",
        responseType: 'arraybuffer'
      }, request + "/" + warehouseCode).toPromise();
      this.openPdf(response);
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getAssurSaleReport(startDate: string, endDate: string): Promise<any> {
    const response = await this.httpClientService.get<AssurSaleReport>({ controller: "Raports/get-assur-sale-raport/" + startDate.toString() }, endDate.toString()).toPromise()
    return response;
  }
  async getAssurTillReport(startDate: string, endDate: string, currAccCode: string): Promise<TillReport[]> {
    const response = await this.httpClientService.get<TillReport>({ controller: "Raports/get-till-report/" + startDate.toString() }, endDate.toString() + "/" + currAccCode).toPromise()
    return response;
  }
  async getBankReport(startDate: string, endDate: string, currAccCode: string): Promise<BankReport[]> {
    const response = await this.httpClientService.get<BankReport>({ controller: "Raports/get-bank-report/" + startDate.toString() }, endDate.toString() + "/" + currAccCode).toPromise()
    return response;
  }
}
