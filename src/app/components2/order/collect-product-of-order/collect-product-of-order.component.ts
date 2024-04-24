import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectedProductsOfRetailOrder } from 'src/app/models-2/Count/collectedProductsOfRetailOrder';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { RetailOrderService } from 'src/app/services/admin/retail/retail-order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-collect-product-of-order',
  templateUrl: './collect-product-of-order.component.html',
  styleUrls: ['./collect-product-of-order.component.css'],
})
export class CollectProductOfOrderComponent implements OnInit {
  productsToCollect: ProductOfOrder[] = [];
  collectedProducts: CollectedProductsOfRetailOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: RetailOrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) { }

  async ngOnInit() {
    this.formGenerator();
    this.activatedRoute.params.subscribe(params => {

      this.orderNo = params["number"];
      this.toasterService.success("Sipariş numarası: " + params["number"]);
    })
    await this.getAllProductsOfOrder(this.orderNo);

  }

  async getItemsToBeCollected(orderNo: string) {

    var response = await this.orderService.getItemsToBeCollected(orderNo);
    this.productsToCollect = response;

  }

  async getCollectedProducts(orderNo: string) {
    var response = await this.orderService.getCollectedProductsOfRetailOrder(orderNo);
    this.collectedProducts = response;
  }

  async getAllProductsOfOrder(orderNo: string) {
    await this.getCollectedProducts(orderNo);
    await this.getItemsToBeCollected(orderNo);
  }

  async deleteCollectProductOfOrder(id: string) {
    var response = await this.orderService.deleteCollectedProductsOfRetailOrder(id);
    if (response) {
      this.toasterService.success("Ürün silme işlemi başarılı");
      await this.getAllProductsOfOrder(this.orderNo);
      await this.getAllProductsOfOrder(this.orderNo);
    } else {
      this.toasterService.error("Ürün silme işlemi başarısız");
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
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null, Validators.required]
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

      if (productModel.shelfNo == "" || productModel.shelfNo == undefined || productModel.shelfNo == null) {

        var requestModel: CountProductRequestModel = new CountProductRequestModel();
        requestModel.barcode = productModel.barcode;
        requestModel.shelfNo = "";
        //saymıyor sadece raf ve barkod doğrulaması getiriyor
        var response = await this.orderService.countProductOfOrder(requestModel);

        if (response === undefined) {

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
        if (foundProduct) {
          var request: CollectedProductsOfRetailOrder = new CollectedProductsOfRetailOrder();
          request.barcode = foundProduct.barcode;
          request.lineId = foundProduct.lineId;
          request.orderNumber = this.orderNo;
          request.packageNumber = foundProduct.packageNo;
          request.quantity = foundProduct.quantity;
          request.shelfNo = foundProduct.shelfNo;

          if (request.quantity > foundProduct.quantity) {
            this.toasterService.error("Toplanacak miktar mevcut miktarı aşamaz");
            return;
          }
          var response = await this.orderService.addCollectedProductsOfRetailOrder(request);
          if (response) {
            this.toasterService.success("Ürün toplama işlemi başarılı");

            // this.collectedProducts.push(productModel);
            this.productsToCollect = this.productsToCollect.filter(
              (o) => o.barcode != productModel.barcode
            );
            this.checkForm.reset();
            await this.getAllProductsOfOrder(this.orderNo);

            //selam
            this.focusNextInput("shelfNo");
          } else {
            this.toasterService.error("Ürün toplama işlemi başarısız");
          }


        }
      }
    }
    this.checkForm.get("barcode")?.setValue("");
    this.focusNextInput("barcode");
  }
}
