import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCreateModel } from 'src/app/models/model/product/productCreateModel';
import { AlertifyService } from '../ui/alertify.service';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private alertifyService : AlertifyService,private httpService : HttpClientService) { }

  createProduct(model : ProductCreateModel) : boolean{
    this.httpService.post<ProductCreateModel>({
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
}
