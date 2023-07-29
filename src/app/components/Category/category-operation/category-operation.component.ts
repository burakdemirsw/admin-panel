import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModel } from 'src/app/models/model/product/barcodeModel';
import { CategoryModel } from 'src/app/models/model/category/categoryModel';
import { CategoryService } from 'src/app/services/admin/category.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
declare var window:any
@Component({
  selector: 'app-category-operation',
  templateUrl: './category-operation.component.html',
  styleUrls: ['./category-operation.component.css']
})

export class CategoryOperationComponent implements OnInit {
  formModal : any;
  categories  : CategoryModel[];
  process : boolean = false;
  categoryForm: FormGroup;
  activeTab: number = 1;
  constructor(
    private httpClientService : HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute : ActivatedRoute,
    private spinnerService : NgxSpinnerService,
    private categoryService: CategoryService
  ) {

  }
 
  ngOnInit() {

   
    this.activatedRoute.params.subscribe(params=>{
      this.spinnerService.show();
     // this.getCategoryDetail(params["id"]);
      this.formGenerator();
      setTimeout(() => {
        this.spinnerService.hide();
      }, 1000);
    })
  
  }
  barcodeModel: BarcodeModel = new BarcodeModel();

  displayModal = true;

  openModal() {
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


  getCategoryDetail(id: string): any {

    try {
      this.httpClientService
        .get<CategoryModel>({
          controller: 'Categories/'+id,
        })   
        .subscribe((data) => {
          //console.log(data);
          this.categories = data;

        });
    } catch (error: any) {
      console.log(error.message);
    }
  }


  currentQrCode : string = "";
  formGenerator() {
    this.categoryForm = this.formBuilder.group({

      id: [0, Validators.required],
      description: [ '', Validators.required],
      topCategory: [ '', Validators.required],
      subCategory: [ '', Validators.required],
      subCategory2: ['', Validators.required],
      subCategory3: ['', Validators.required],
      subCategory4: [ '', Validators.required],
      subCategory5: [ '', Validators.required]
    }); 
  }
  onSubmit(categoryModel: CategoryModel) {
    this.spinnerService.show();
    if (this.categoryForm.valid) {
      this.categoryService.addCategory(categoryModel);
      this.alertifyService.success('Ürün isteği yolladı');

      console.log(categoryModel);
    } else {
      this.alertifyService.error('Formu doldurunuz');
      console.log(categoryModel);
    }

     this.spinnerService.hide();


    // setTimeout(() => {
    //   this.spinnerService.hide();
    //   window.location.reload();
    // }, 2000);
  }
}
