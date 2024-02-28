import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { HttpClient } from '@angular/common/http';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';

@Component({
  selector: 'app-collect-product-of-order',
  templateUrl: './collect-product-of-order.component.html',
  styleUrls: ['./collect-product-of-order.component.css'],
})
export class CollectProductOfOrderComponent implements OnInit {
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

    private httpClient: HttpClient,

  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.getCollectedProducts(params["number"]);
    })
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
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
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
      shelfNo: ['', Validators.required]

    });
  }
  setStatusOfPackages(list: ProductOfOrder[]) {
    //nebime yolla

    try {
      this.httpClientService
        .post<ProductOfOrder[]>({
          controller: 'Order/SetStatusOfPackages',
        }, list)
        .subscribe((data) => {
          console.log("Etkilenen Satır Sayısı:" + data)
        });
    } catch (error: any) {
      console.log(error.message);
    }


  }
  async onSubmit(productModel: ProductOfOrder) {
    if (this.checkForm.valid || productModel.shelfNo == "") {
      //eğer raf kısmı boşsa sp den rafı al yerine koy sonra barcode a focus at
      //console.log(productModel);

      if (productModel.shelfNo == "" || productModel.shelfNo == undefined || productModel.shelfNo == null) {
        const url = ClientUrls.baseUrl + '/Order/CountProduct';
        var requestModel: CountProductRequestModel = new CountProductRequestModel();
        requestModel.barcode = productModel.barcode;
        requestModel.shelfNo = "";
        var response = await this.httpClient.post<ProductCountModel | undefined>(url, requestModel).toPromise();

        if (response === undefined) {
          // Handle the undefined case, perhaps throw an error or set a default value.
        } else {
          var data: ProductCountModel = response;

          if (data.status == "RAF") {
            this.checkForm.get("shelfNo")?.setValue(data.description);
            productModel.shelfNo = response.description;
          }
        }

      }
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
          this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');


          foundProduct.quantity -= 1;
          this.collectedProducts.push(foundModel);
          this.checkForm.get("shelfNo")?.setValue(productModel.shelfNo);

        } else if (foundProduct?.quantity === 1) {
          this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');

          this.checkForm.get("shelfNo")?.setValue("");

          const index = this.productsToCollect.indexOf(foundProduct);
          this.collectedProducts.push(foundModel);
          foundProduct.quantity -= 1;

          this.productsToCollect.splice(index, 1);

          if (this.productsToCollect.length === 0) {
            alert('Tüm Ürünler Toplandı!');

            this.setStatusOfPackages(this.collectedProducts)
            this.router.navigate(['/orders-managament']);
          }

        }
      }
    }
    this.checkForm.get("barcode")?.setValue("");
    this.focusNextInput("barcode");
  }
}
