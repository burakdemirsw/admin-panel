import { Injectable } from '@angular/core';
import { BarcodeAddModel } from 'src/app/models/model/product/barcodeAddModel';
import { HttpClientService } from '../http-client.service';
import { AlertifyService } from '../ui/alertify.service';
import { CategoryModel } from 'src/app/models/model/category/categoryModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private alertifyService : AlertifyService,private httpService : HttpClientService) { }

  addCategory(model : CategoryModel) : boolean{
    this.httpService.post<CategoryModel>({
      controller: 'Categories',
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

  deleteCategory(id : number) : boolean{
    this.httpService.delete<CategoryModel>({
      controller: 'Categories',
    },id)
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
