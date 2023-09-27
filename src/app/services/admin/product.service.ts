import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCreateModel } from 'src/app/models/model/product/productCreateModel';
import { AlertifyService } from '../ui/alertify.service';
import { HttpClientService } from '../http-client.service';
import { Router } from '@angular/router';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(    private alertifyService: AlertifyService,
    private httpClientService: HttpClientService,
    private router: Router) { }

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
    async countProductByBarcode(barcode: string): Promise<string> {
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
         
        return shelfNumbers;
      } catch (error: any) {
        console.error(error.message);
        throw error; // Rethrow the error if needed
      }
    }
}
