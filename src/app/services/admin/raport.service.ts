import { Injectable, model } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LogFilterModel } from 'src/app/models/model/log/logFilterModel ';
import { Raport_BestSeller, Raport_ProductExtract, Raport_ProductInventory } from 'src/app/models/model/raport/raport_CR';

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
}
