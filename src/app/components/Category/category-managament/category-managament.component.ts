import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CategoryModel } from 'src/app/models/model/category/categoryModel';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { CategoryService } from 'src/app/services/admin/category.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
declare var window:any

@Component({
  selector: 'app-category-managament',
  templateUrl: './category-managament.component.html',
  styleUrls: ['./category-managament.component.css']
})
export class CategoryManagamentComponent implements OnInit {
  formModal : any;
  categories : CategoryModel[];
  selectedCategoryId: number | null = null;
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private categoryService : CategoryService

  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.getCategories();
    this.spinnerService.hide();

  }
  openModal(id :number) {
    this.selectedCategoryId = id;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(document.getElementById("myModal"));
    }
    this.formModal.show();
  }
  closeModal() {
    if (this.formModal) {
      this.formModal.hide();
    }
  }

  deleteCategory(): any{
    if (this.selectedCategoryId !== null) {
      // Silme işlemini gerçekleştirin
      // this.selectedCategoryId değerini kullanarak kategori silme işlemini gerçekleştirin
      this.categoryService.deleteCategory(this.selectedCategoryId)
    }
    if (this.formModal) {
      this.formModal.hide();
    }
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
