import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-collected-package-detail',
  templateUrl: './collected-package-detail.component.html',
  styleUrls: ['./collected-package-detail.component.css'],
})
export class CollectedPackageDetailComponent implements OnInit {
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.getCollectedProducts(params['id']);
    });
    this.formGenerator();
    // this.getOrdersProduct("1-WS-2-11626")
  }

  getCollectedProducts(numberOfList: string): any {
    try {
      this.httpClientService
        .get<ProductOfOrder>({
          controller: 'Order/GetOrderSaleDetailById/' + numberOfList.toString(),
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
    });
  }
  onSubmit(productModel: ProductOfOrder) {
    if (this.checkForm.valid) {
     
      this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');

      console.log(productModel);
      var foundModel = this.productsToCollect.find(
        (o) => o.barcode == productModel.barcode
      );
      if (foundModel) {
        const foundProduct = this.productsToCollect.find(
          (o) => o.barcode == productModel.barcode
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

            this.router.navigate(['/orders-managament']);
          }
        }
      }
    }
  }
}
