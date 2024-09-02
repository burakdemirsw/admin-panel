import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CreateBarcodeFromOrder_RM } from 'src/app/components/Product/create-barcode/models/createBarcode';

@Injectable({
  providedIn: 'root'
})
export class DirectServiceService {
  controller = "direct-request";
  controller_2 = "products";
  constructor(
    private httpClientService: HttpClientService,

  ) { }

  //sendNebimBarcodesOfShelfProducts

  async sendNebimBarcodesOfShelfProducts(request: CreateBarcodeFromOrder_RM): Promise<any> {
    try {
      var response = await this.httpClientService.post<any>({ controller: this.controller_2 + "/send-barcode-models-to-nebim" }, request).toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async syncPhoto(): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: this.controller + "/fetch-missing-files" }).toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async updatePhoto(itemCodes: string[]): Promise<any> {
    try {
      var response = await this.httpClientService.post<any>({ controller: this.controller + "/update-product-images" }, itemCodes).toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
}
