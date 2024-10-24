import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { GeneralService } from './general.service';
import { CatalogHeader, CatalogProduct } from 'src/app/models/model/warehouse/transferRequestListModel';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private generalService: GeneralService,
    private httpClient: HttpClient
  ) { }

  // Get Catalog Products
  async getCatalogProducts(request: string): Promise<CatalogProduct[]> {
    const response: CatalogProduct[] = await this.httpClientService
      .get_new<CatalogProduct>({ controller: 'Products/get-catalog-products' }, request)
      .toPromise();

    return response;
  }

  // Delete Catalog Product
  async deleteCatalogProduct(request: string): Promise<boolean> {
    const response: boolean = await this.httpClientService
      .get_new<boolean>({ controller: 'Products/delete-catalog-product' }, request)
      .toPromise();

    return response;
  }

  // Add Catalog Product
  async addCatalogProduct(request: CatalogProduct): Promise<any> {
    var _request: CatalogProduct[] = [request];
    const response: CatalogProduct = await this.httpClientService
      .post<CatalogProduct>({ controller: 'Products/add-catalog-product' }, _request)
      .toPromise();

    return response;
  }
  async addCatalogProductBatch(request: CatalogProduct[]): Promise<any> {

    const response: CatalogProduct = await this.httpClientService
      .post<CatalogProduct>({ controller: 'Products/add-catalog-product' }, request)
      .toPromise();

    return response;
  }
  // Update Catalog Product
  async updateCatalogProduct(request: CatalogProduct): Promise<any> {
    const response: CatalogProduct = await this.httpClientService
      .post<CatalogProduct>({ controller: 'Products/update-catalog-product' }, request)
      .toPromise();

    return response;
  }
  async createCatalogReport(request: string): Promise<any> {
    try {
      var response: any = await this.httpClientService.get<any>({
        controller: "Products/create-catalog-raport", responseType: 'arraybuffer'
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

  // Get Catalog Product List
  async getCatalogProductList(type: boolean): Promise<CatalogProduct[]> {
    const response: CatalogProduct[] = await this.httpClientService
      .get_new<CatalogProduct>({ controller: 'Products/get-catalog-product-list' }, type.toString())
      .toPromise();

    return response;
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

  // 1. Get All CatalogHeaders
  async getAllCatalogHeaders(): Promise<CatalogHeader[]> {
    const response: CatalogHeader[] = await this.httpClientService
      .get_new<CatalogHeader>({ controller: 'Products/get-all-catalog-headers' })
      .toPromise();

    return response;
  }

  // 2. Get CatalogHeader By ID
  async getCatalogHeaderById(id: string): Promise<CatalogHeader> {
    const response: CatalogHeader = await this.httpClientService
      .get_new<CatalogHeader>({ controller: 'Products/get-catalog-header-by-id' }, id)
      .toPromise();

    return response;
  }

  // 3. Add New CatalogHeader
  async addCatalogHeader(header: CatalogHeader): Promise<CatalogHeader> {
    const response: CatalogHeader = await this.httpClientService
      .post<CatalogHeader>({ controller: 'Products/add-catalog-header' }, header)
      .toPromise();

    return response;
  }

  // 4. Update CatalogHeader
  async updateCatalogHeader(header: CatalogHeader): Promise<boolean> {
    const response: boolean = await this.httpClientService
      .post<boolean>({ controller: 'Products/update-catalog-header' }, header)
      .toPromise();

    return response;
  }

  // 5. Delete CatalogHeader
  async deleteCatalogHeader(id: string): Promise<boolean> {
    const response: boolean = await this.httpClientService
      .get_new<boolean>({ controller: 'Products/delete-catalog-header' }, id)
      .toPromise();

    return response;
  }

}
