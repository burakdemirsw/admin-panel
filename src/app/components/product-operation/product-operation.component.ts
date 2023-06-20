import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductCreateModel } from 'src/app/models/model/productCreateModel';
import { ProductModel } from 'src/app/models/model/productModel';
import { ProductService } from 'src/app/services/admin/product.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
declare var alertify: any;
@Component({
  selector: 'app-product-operation',
  templateUrl: './product-operation.component.html',
  styleUrls: ['./product-operation.component.css'],
})
export class ProductOperationComponent implements OnInit {
  productForm: FormGroup;
  activeTab: number = 1;
  constructor(
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private productService: ProductService
    ,private spinnerService : NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    this.formGenerator();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);
  }

  formGenerator() {
    this.productForm = this.formBuilder.group({
      productName: ['string', Validators.required],
      stockAmount: ['3', Validators.required],
      barcode: [crypto.randomUUID(),],
      stockCode: ['31', Validators.required],
      dimention: ['S', Validators.required],
      purchasePrice: ['11', Validators.required],
      sellingPrice: ['11', Validators.required],
      url: ['string', Validators.required], //fotoğraf ekleme html css'i yapılacak
      subCategoryId: ['2', Validators.required],
      colorId: ['1', Validators.required],
      brandId: ['1', Validators.required],
      blocked: [true, Validators.required], //default false
      new: [true, Validators.required], //default true
      createdDate: ['2021-05-05', Validators.required],
      updatedDate: ['2021-05-05', Validators.required],
    });
  }

  onSubmit(productData: ProductCreateModel) {
    this.spinnerService.show();
    if (this.productForm.valid) {
      this.productService.createProduct(productData);
      this.alertifyService.success('Ürün isteği yolladı');

      console.log(productData);
    } else {
      this.alertifyService.error('Formu doldurunuz');
      console.log(productData);
    }
    setTimeout(() => {
      this.spinnerService.hide();
      window.location.reload();
    }, 2000);
  }
}
