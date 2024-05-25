import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { CreatePackage_MNG_RM, CargoBarcode_VM } from 'src/app/components/cargo/create-cargo/models/models';
import { ZTMSG_CreateCargoBarcode_CM, ZTMSG_CreateCargoBarcode_RM } from 'src/app/models/model/cargo/ZTMSG_CreateCargoBarcode_CM';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  async createCargo(request: CreatePackage_MNG_RM, firmId: number): Promise<any> {
    if (firmId === 1) {
      try {
        var response = await this.httpClientService.post<any>({ controller: "cargos/create-cargo" }, request).toPromise();
        return response;
      } catch (error: any) {
        console.log(error.message);
        return null;
      }
    } else if (firmId === 2) {
      try {
        var response = await this.httpClientService.post<any>({ controller: "cargos/create-aras-cargo" }, request).toPromise();
        return response;
      } catch (error: any) {
        console.log(error.message);
        return null;
      }
    }
    else if (firmId === 3) {
      try {
        var response = await this.httpClientService.post<any>({ controller: "cargos/create-aras-cargo" }, request).toPromise();
        return response;
      } catch (error: any) {
        console.log(error.message);
        return null;
      }
    } else {
      return;
    }


  }

  async createBarcode(request: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "cargos/create-barcode", responseType: 'arraybuffer' }, request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async printSingleBarcode(request: string): Promise<any> {
    try {
      var _request = { ZplBarcode: request }
      var response = await this.httpClientService.post<any>({ controller: "cargos/print-single-barcode" }, _request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async getShippedCargos(isPrinted: boolean): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "cargos/get-shipped-cargos" }, isPrinted.toString()).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getPackageStatus(shipmentId: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "cargos/get-package-status" }, shipmentId).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  async deleteCargo(cargo: CargoBarcode_VM, cargoFirmId: number): Promise<any> {

    if (cargoFirmId === 1) {
      var request = {
        ReferenceId: cargo.referenceId,
        ShipmentId: cargo.shipmentId,
      }
      try {
        var response = await this.httpClientService.post<any>({ controller: "cargos/delete-shipped-cargo" }, request).toPromise();

        return response;
      } catch (error: any) {
        console.log(error.message);
        return null;
      }
    } else {
      var request = {
        ReferenceId: cargo.referenceId,
        ShipmentId: cargo.shipmentId,
      }
      try {
        var __response = await this.httpClientService.get<any>({ controller: "cargos/delete-aras-order" }, cargo.referenceId).toPromise();

        return __response;
      } catch (error: any) {
        console.log(error.message);
        return null;
      }
    }

  }
  async printBarcodeFromBase64(request: string): Promise<any> {
    try {

      var _request = { ZplBarcode: request }
      var response = await this.httpClientService.post<any>({ controller: "cargos/print-single-barcode" }, _request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async createCargoBulk(request: ZTMSG_CreateCargoBarcode_CM[]): Promise<ZTMSG_CreateCargoBarcode_RM<any>[]> {
    try {
      var response = await this.httpClientService.post<any>({ controller: "cargos/create-cargo-bulk" }, request).toPromise();
      var list: ZTMSG_CreateCargoBarcode_RM<any>[] = response;

      var responseText = request.length + " adet kargodan " + list.filter(x => x.Status === true).length + " adet kargo başarıyla oluşturuldu.";
      this.toasterService.info(responseText);
      return list;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  //PrintBarcodeFromBase64
}
