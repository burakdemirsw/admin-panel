import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductModel } from 'src/app/models/model/productModel';

@Component({
  selector: 'app-product-operation',
  templateUrl: './product-operation.component.html',
  styleUrls: ['./product-operation.component.css']
})
export class ProductOperationComponent implements OnInit {
  productForm: FormGroup;
  activeTab : number =1 ;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formGenerator();
  }


  formGenerator(){
    this.productForm = this.formBuilder.group({   
      productName: [],
      stockAmount: [],
      barcode: [],
      stockCode: [],
      url: [],
      createdDay: [],
      updatedDay: [],
      categoryDescription: [],
      colorDescription: [],
      blocked: []
    });
  }
  onSubmit(productData: ProductModel) {
    console.log(productData);
  }


}
