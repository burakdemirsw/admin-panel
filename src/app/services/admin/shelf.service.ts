import { Injectable } from '@angular/core';
import { ProductCreateModel } from 'src/app/models/model/product/productCreateModel';
import { HttpClientService } from '../http-client.service';
import { AlertifyService } from '../ui/alertify.service';
import { ShelfModel } from 'src/app/models/model/shelf/ShelfModel';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {

  constructor(private alertifyService : AlertifyService,private httpService : HttpClientService) { }

  createShelf(model : ShelfModel) : boolean{
    this.httpService.post<ShelfModel>({
      controller: 'Shelves/Add',
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
