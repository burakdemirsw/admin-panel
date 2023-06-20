import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CategoryModel } from 'src/app/models/model/categoryModel';
import { SaleOrderModel } from 'src/app/models/model/saleOrderModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-category-managament',
  templateUrl: './category-managament.component.html',
  styleUrls: ['./category-managament.component.css']
})
export class CategoryManagamentComponent implements OnInit {

  categories : CategoryModel[]
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.getCategories();
    this.spinnerService.hide();

  }
  getCategories(): any {
    try {
      this.httpClientService
        .get<CategoryModel>({
          controller: 'Categories',
        })
        .subscribe((data) => {
          //console.log(data);
          this.categories = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

}
