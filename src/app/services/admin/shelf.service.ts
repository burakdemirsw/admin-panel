import { Injectable } from '@angular/core';
import { ProductCreateModel } from 'src/app/models/model/product/productCreateModel';
import { HttpClientService } from '../http-client.service';
import { ShelfModel } from 'src/app/models/model/shelf/ShelfModel';
import { ToasterService } from '../ui/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {

  constructor(private toasterService: ToasterService, private httpService: HttpClientService) { }

  createShelf(model: ShelfModel): boolean {
    this.httpService.post<ShelfModel>({
      controller: 'Shelves/Add',
    }, model)
      .subscribe({
        next: result => {
          this.toasterService.success('Success');
          window.location.reload();
        },
        error: err => {
          if (err.status === 400) {
            this.toasterService.warn(err.error);
          } else {
            this.toasterService.warn(err.message);
          }
        }
      });
    return true
  }
}
