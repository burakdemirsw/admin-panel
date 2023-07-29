import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/model/product/product';
import { ProductDetail } from 'src/app/models/model/product/productDetail';
import { ProductModel } from 'src/app/models/model/product/productModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  products: ProductModel[];
  showImage = false; // add this property
  view = true;
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService
  ) {}
  ngOnInit(): void {

    this.spinnerService.show();
    this.products = this.getProducts();

    this.spinnerService.hide();
  }
  selectedProductList: number[] = [];

  DeleteAllSelectedProducts() {
    this.spinnerService.show();
    this.selectedProductList.forEach((element) => {
      this.httpClientService
        .delete<any>(
          {
            controller: 'Product',
          },
          element
        )
        .subscribe((data) => {
          console.log(data);
        });
    });
    setTimeout(() => {
      this.spinnerService.hide();
      window.location.reload();
    }, 2000);
  }
  SelectedProductListManager(id: number) {
    if (this.selectedProductList.includes(id)) {
      this.SelectedProductListRemover(id);
      this.alertifyService.success('Ürün silindi');
      console.log(this.selectedProductList);
    } else {
      this.SelectedProductListAdder(id);
      this.alertifyService.success('Ürün eklendi');
      console.log(this.selectedProductList);
    }
  }

  SelectedProductListAdder(id: number) {
    this.selectedProductList.push(id);
  }

  SelectedProductListRemover(id: number) {
    const index = this.selectedProductList.findIndex((x) => x === id);
    if (index !== -1) {
      this.selectedProductList.splice(index, 1);
    }
  }

  stateChanger(value: boolean) {
    if (value === false) {
      value = true;
    } else {
      value = false;
    }
  }
  getProducts(): any {
    try {
      this.httpClientService
        .get<ProductModel>({
          controller: 'Product',
        })
        .subscribe((data) => {
          console.log(data);
          this.products = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
