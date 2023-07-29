import { Injectable } from '@angular/core';
import { AlertifyService } from '../ui/alertify.service';
import { BarcodeAddModel } from 'src/app/models/model/product/barcodeAddModel';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private alertifyService : AlertifyService,private httpService : HttpClientService) { }

    addProductToOrder(model : BarcodeAddModel) : boolean{
      this.httpService.post<BarcodeAddModel>({
        controller: 'Order/Add',
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

