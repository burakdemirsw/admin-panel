import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeAddModel } from 'src/app/models/model/product/barcodeAddModel';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { OrderSaleDetail } from 'src/app/models/model/order/orderSaleDetail';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-collect-product-of-order',
  templateUrl: './collect-product-of-order.component.html',
  styleUrls: ['./collect-product-of-order.component.css'],
})
export class CollectProductOfOrderComponent implements OnInit {
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[]=[];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params=>{
      this.getCollectedProducts(params["number"]);
    })
    this.formGenerator();
    // this.getOrdersProduct("1-WS-2-11626")
  }

  getCollectedProducts(numberOfList : string): any {
    try {
      this.httpClientService
        .get<ProductOfOrder>({
          controller: 'Order/GetOrderSaleDetailById/'+numberOfList.toString(),
        })
        .subscribe((data) => {
          //console.log(data);
          this.productsToCollect = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];

  deleteRow(index: number) {
    this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
  }
  orderNo: string = '';

  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: ['', Validators.required],
      shelfNo: ['', Validators.required],
    });
  }
  setStatusOfPackages(list : ProductOfOrder[]){
    //nebime yolla

    try {
      this.httpClientService
        .post<ProductOfOrder[]>({
          controller: 'Order/SetStatusOfPackages',
        },list)
        .subscribe((data) => {
          console.log("Etkilenen Satır Sayısı:" + data)
        });
    } catch (error: any) {
      console.log(error.message);
    }


  }
  onSubmit(productModel: ProductOfOrder) {
    if (this.checkForm.valid) {
      this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');

      console.log(productModel);
      var foundModel = this.productsToCollect.find(
        (o) =>
          o.barcode == productModel.barcode && o.shelfNo == productModel.shelfNo
      );
      if (foundModel) {
        const foundProduct = this.productsToCollect.find(
          (o) =>
            o.barcode == productModel.barcode &&
            o.shelfNo == productModel.shelfNo
        );
        if (
          foundProduct &&
          foundProduct.quantity &&
          foundProduct.quantity > 1
        ) {
          foundProduct.quantity -= 1;
          this.collectedProducts.push(foundModel);
        } else if (foundProduct?.quantity === 1) {
          const index = this.productsToCollect.indexOf(foundProduct);
          this.collectedProducts.push(foundModel);
          foundProduct.quantity -= 1;
          if (index === 0) {
            this.productsToCollect.splice(index, 1);

            if (this.productsToCollect.length === 0) {
              alert('Tüm Ürünler Toplandı!');
            }
            this.setStatusOfPackages( this.collectedProducts)
            this.router.navigate(['/orders-managament']);
            
          }
        }
      }
    }
  }
}
