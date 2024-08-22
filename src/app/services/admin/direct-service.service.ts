import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class DirectServiceService {
  controller = "direct-request";
  constructor(
    private httpClientService: HttpClientService,

  ) { }

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
