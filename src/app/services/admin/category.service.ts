import { Injectable } from '@angular/core';
import { CategoryModel } from 'src/app/models/model/category/categoryModel';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private toasterService: ToasterService, private httpService: HttpClientService) { }

  addCategory(model: CategoryModel): boolean {
    this.httpService.post<CategoryModel>({
      controller: 'Categories',
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

  deleteCategory(id: number): boolean {
    this.httpService.delete<CategoryModel>({
      controller: 'Categories',
    }, id)
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
