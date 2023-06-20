import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModel } from 'src/app/models/model/barcodeModel';
import { ProductCreateModel } from 'src/app/models/model/productCreateModel';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { BarcodeAddModel } from '../../models/model/barcodeAddModel';
import { OrderSaleDetail } from 'src/app/models/model/orderSaleDetail';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/admin/order.service';

@Component({
  selector: 'app-order-operation',
  templateUrl: './order-operation.component.html',
  styleUrls: ['./order-operation.component.css']
})
export class OrderOperationComponent implements OnInit {
  orderSaleDetails  : OrderSaleDetail[];
  process : boolean = false;
  orderForm: FormGroup;
  activeTab: number = 1;
  constructor(
    private httpClientService : HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute : ActivatedRoute,
    private spinnerService : NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params=>{
      this.spinnerService.show();
      this.geOrderSaleDetail(params["orderNumber"]);
      this.formGenerator();
      setTimeout(() => {
        this.spinnerService.hide();
      }, 1000);
    })

  }
  barcodeModel: BarcodeModel = new BarcodeModel();

  geOrderSaleDetail(orderNumber: string): any {

    try {
      this.httpClientService
        .get<OrderSaleDetail>({
          controller: 'Order/GetOrderSaleDetail/'+orderNumber,
        })
        .subscribe((data) => {
          //console.log(data);
          this.orderSaleDetails = data;

        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  getProductByBarcode(value: string): any {

    try {
      this.httpClientService
        .get<BarcodeModel>({
          controller: 'Order/GetBarcodeDetail/'+value,
        })
        .subscribe((data) => {
          //console.log(data);
          this.barcodeModel = Object.assign(new BarcodeModel(), data[0]);

          this.formGenerator();
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  onModelChanged(value: string) {
    if (value.length > 10) {
      this.currentQrCode = value;
      this.getProductByBarcode(value);
    }
  }
  currentQrCode : string = "";
  formGenerator() {
    this.orderForm = this.formBuilder.group({

      id: [0, Validators.required],
      qr: [this.currentQrCode || '', Validators.required],
      barcode: [this.barcodeModel?.barcode || '', Validators.required],
      party: [this.barcodeModel?.parti || '', Validators.required],
      shelf: [this.barcodeModel?.rafNo || '', Validators.required],
      quantity: [this.barcodeModel?.miktar || 0, Validators.required],
      invoiceNumber: [this.barcodeModel?.priceCurrency || '', Validators.required]
    });
  }
  onSubmit(barcodeAddModel: BarcodeAddModel) {
    this.spinnerService.show();
    if (this.orderForm.valid) {
      this.orderService.addProductToOrder(barcodeAddModel);
      this.alertifyService.success('Ürün isteği yolladı');

      console.log(barcodeAddModel);
    } else {
      this.alertifyService.error('Formu doldurunuz');
      console.log(barcodeAddModel);
    }

     this.spinnerService.hide();


    // setTimeout(() => {
    //   this.spinnerService.hide();
    //   window.location.reload();
    // }, 2000);
  }
}
