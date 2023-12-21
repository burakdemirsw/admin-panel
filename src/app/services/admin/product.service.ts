import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCreateModel } from 'src/app/models/model/product/productCreateModel';
import { AlertifyService } from '../ui/alertify.service';
import { HttpClientService } from '../http-client.service';
import { Router } from '@angular/router';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { HttpClient } from '@angular/common/http';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { ProductCountModel2 } from 'src/app/models/model/product/productCountModel2';
import { WarehouseFormModel } from 'src/app/models/model/warehouse/warehosueTransferModel';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import { QrCode } from 'src/app/models/model/product/qrCode';
import { QrControlCommandModel } from 'src/app/models/model/product/qrControlModel';
import { BarcodeModelResponse, BarcodeModel_A } from 'src/app/models/model/barcode/barcodeModel_A';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private alertifyService: AlertifyService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  //ürün oluşturma
  createProduct(model: ProductCreateModel): boolean {
    this.httpClientService
      .post<ProductCreateModel>(
        {  
          controller: 'Product',
        },
        model
      )
      .subscribe({
        next: (result) => {
          this.alertifyService.success('Success');
          window.location.reload();
        },
        error: (err) => {
          if (err.status === 400) {
            this.alertifyService.warning(err.error);
          } else {
            this.alertifyService.warning(err.message);
          }
        },
      });
    return true;
  }

  //barkod ile ürün sayma işlemi
  async countProductByBarcode(barcode: string): Promise<string[]> {
    try {
      if (barcode.includes('/')) {
        barcode = barcode.replace(/\//g, '-');
      }
      const model: ProductCountModel[] = await this.httpClientService
        .get<ProductCountModel>({
          controller: 'Order/GetShelvesOfProduct/' + barcode,
        })
        .toPromise();

      var shelfNumbers: string = '';
      model.forEach((element) => {
        shelfNumbers += element.description + ',';
      });
      var results: string[] = [];
      results.push(shelfNumbers);
      results.push(model[0].status);

      return results;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }

  //barkod ile ürün sayma işlemi | ürün kodu
  async countProductByBarcode2(barcode: string): Promise<string> {
    try {
      if (barcode.includes('/')) {
        barcode = barcode.replace(/\//g, '-');
      }

      const model: ProductCountModel2[] = await this.httpClientService
        .get<ProductCountModel2>({
          controller: 'Order/CountProductByBarcode2/' + barcode,
        })
        .toPromise();

      if (model.length > 0) {
        return model[0].itemCode;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }

  //sayılan ürünleri getirme
  async getCollectedOrderProducts(
    orderNo: string
  ): Promise<CollectedProduct[]> {
    const response = await this.httpClientService
      .get<CollectedProduct>({
        controller: 'Order/GetCollectedOrderProducts/' + orderNo, //GET_MSRafCollectedProducts
      })
      .toPromise();
    return response;
  }

  //sayımı tamamlama
  async completeCount(orderNo: string): Promise<any> {
    const response = await this.httpClientService
      .get<any>({ controller: 'Order/CompleteCount/' + orderNo })
      .toPromise();
    return response;
  }
  //sayım içindeki ürünü silme  
  async deleteOrderProduct(
    orderNo: string,
    itemCode: string
  ): Promise<boolean> {
    try {
      const requestModel = {
        orderNumber: orderNo,
        itemCode: itemCode,
      };

      const response = await this.httpClientService
        .post<any>({ controller: 'Order/DeleteProductOfCount' }, requestModel)
        .toPromise();

      if (response > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Hata (90):', error);
      return false;
    }
  }

  //transfer ürünleriini sayma
  async countTransferProduct(
    model: WarehouseFormModel
  ): Promise<ProductCountModel> {
    try {
      const response = await this.httpClientService
        .post<any>({ controller: 'Order/CountTransferProduct' }, model)
        .toPromise();

      if (response) {
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteProductFromFastTransfer(
    orderNo: string,
    itemCode: string
  ): Promise<boolean> {
    try {
      const requestModel = {
        orderNumber: orderNo,
        itemCode: itemCode,
      };

      const response = await this.httpClientService
        .post<any>(
          { controller: 'Order/DeleteProductFromFastTransfer' },
          requestModel
        )
        .toPromise();

      if (response > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Hata (90):', error);
      return false;
    }
  }

  //faturanın ürünlerini getirme
  async getProductOfInvoice(orderNo: string): Promise<CreatePurchaseInvoice[]> {
    const response = await this.httpClientService
      .get<CreatePurchaseInvoice>(
        { controller: 'Order/GetProductOfInvoice' }, //Get_ProductOfInvoice
        orderNo
      )
      .toPromise();

    return response;
  }

   //faturanın ürünlerini getirme
   async searchProduct(model: BarcodeSearch_RM): Promise<any> {
    const response = await this.httpClientService
      .post<BarcodeSearch_RM>(
        { controller: 'Products/SearchProduct' },
        model
      )
      .toPromise();

    return response;
  }

  async getQr(id: string): Promise<any> {
    const response = await this.httpClientService
      .get<QrCode>(
        { controller: 'Products/get-qr' },id       
      )
      .toPromise();

    return response;
  }

  async addQr(model: QrCode): Promise<any> {
    const response = await this.httpClientService
      .post<QrCode>(
        { controller: 'Products/AddQr' },
        model
      )
      .toPromise();

    return response;
  }


   async qrControl(qr: string): Promise<any> {
    var model  : QrControlCommandModel = new QrControlCommandModel()
    model.qr = qr
    const response = await this.httpClientService
      .post<QrControlCommandModel|any>(
        { controller: 'Products/QrControl' },
        model
      )
      .toPromise();
  
    return response;
  }
 
  async getBarcodePage(model: BarcodeModel_A): Promise<any> {
    const response:BarcodeModelResponse = await this.httpClient
      .post<QrControlCommandModel|any>(
        ClientUrls.baseUrl+'/Products/GenerateBarcode_A' ,
        model
      )
      .toPromise();  
    return response;
  }
}
export class BarcodeSearch_RM
{
     barcode !: string
}