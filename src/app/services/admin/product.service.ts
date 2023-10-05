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

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(    private alertifyService: AlertifyService,
    private httpClientService: HttpClientService,
    private router: Router,private httpClient : HttpClient) { }

    //ürün oluşturma
  createProduct(model : ProductCreateModel) : boolean{
    this.httpClientService.post<ProductCreateModel>({
      controller: 'Product',
    }, model)
      .subscribe({
        next: result => {
          this.alertifyService.success('Success');
          window.location.reload();
        },
        error: err => {
          if (err.status === 400) {
            this.alertifyService.warning( err.error);
          } else {
            this.alertifyService.warning(err.message);
          }
        }
      });
    return true
  }

    //barkod ile ürün sayma işlemi 
    async countProductByBarcode(barcode: string): Promise<string[]> {
      try {
        const model: ProductCountModel[] = await this.httpClientService
          .get<ProductCountModel>({
            controller: 'Order/CountProductByBarcode/' + barcode,
          })
          .toPromise();
    
        var shelfNumbers :string= ''
        model.forEach(element => {
          shelfNumbers+=element.description+","
         })
         var results :string[] = []
         results.push(shelfNumbers)
         results.push(model[0].status)
         
        return results;
      } catch (error: any) {
        console.error(error.message);
       return null;
      }
    }

    //sayılan ürünleri getirme
    async getCollectedOrderProducts (orderNo  :string):Promise<CollectedProduct[]>{
      const response =await this.httpClientService.get<CollectedProduct>({controller:"Order/GetCollectedOrderProducts/"+orderNo}).toPromise()
        return response

    }

    //sayımı tamamlama 
    async completeCount (orderNo  :string):Promise<any>{
      const response =await this.httpClientService.get<any>({controller:'Order/CompleteCount/'+orderNo}).toPromise()
        return response

    }
    //sayım içindeki ürünü silme
    async deleteOrderProduct(orderNo: string, itemCode: string): Promise<boolean> {
      try {
        const requestModel = {
          orderNumber: orderNo,
          itemCode: itemCode
        };
        
        const response = await this.httpClientService.post<any>({controller:'Order/DeleteOrderProduct'},requestModel).toPromise();
        
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

    async deleteProductFromFastTransfer(orderNo: string, itemCode: string): Promise<boolean> {
      try {
        const requestModel = {
          orderNumber: orderNo,
          itemCode: itemCode
        };
        
        const response = await this.httpClientService.post<any>({controller:'Order/DeleteProductFromFastTransfer'},requestModel).toPromise();
        
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
    async getProductOfInvoice(orderNo : string):Promise<CreatePurchaseInvoice[]>{

      const response =await  this.httpClientService.get<CreatePurchaseInvoice>({controller:'Order/GetProductOfInvoice'},orderNo).toPromise();

      return response
    }
}
