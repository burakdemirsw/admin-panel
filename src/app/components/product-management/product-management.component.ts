import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductDetail } from 'src/app/models/productDetail';
import { ProductModel } from 'src/app/models/model/productModel';
import { HttpClientService } from 'src/app/services/http-client.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  products: ProductModel[];
  showImage = false; // add this property
  view = true
  constructor(private httpClientService: HttpClientService) {}
  ngOnInit(): void {

    this.products = this.getProducts();

  }


  stateChanger(value : boolean){
    if(value ===false ) {
      value = true
    }else{
      value = false
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
   } catch (error:any) {
    console.log(error.message)
   }


  }
}
