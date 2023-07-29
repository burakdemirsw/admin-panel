import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeAddModel } from 'src/app/models/model/product/barcodeAddModel';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { OrderSaleDetail } from 'src/app/models/model/order/orderSaleDetail';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-order-billing-operation',
  templateUrl: './order-billing-operation.component.html',
  styleUrls: ['./order-billing-operation.component.css'],
})
export class OrderBillingOperationComponent implements OnInit {
  orderSaleModels: SaleOrderModel[];
  process: boolean = false;
  orderBillingForm: FormGroup;
  activeTab: number = 1;
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,

    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getOrders();
    this.formGenerator('', 0);
    // this.getOrdersProduct("1-WS-2-11626")
  }
 
  getOrders(): any {
    try {
      this.httpClientService
        .get<SaleOrderModel>({
          controller: 'Order',
        })
        .subscribe((data) => {
          //console.log(data);
          this.orderSaleModels = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }


  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];
  getOrdersProduct(orderNo: string): any {
    try {
      this.httpClientService
        .get<OrderBillingListModel>({
          controller: 'Order/OrderBillings/' + orderNo,
        })
        .subscribe((data) => {
          //console.log(data);
          this.orderBillingList = data;
          this.itemBillingModels = data[0].itemBillingModels;
          this.formGenerator(orderNo, data[0].totalValue);
          this.orderBillingForm.setValue({
            orderNo: orderNo,
            totalValue: data[0].totalValue, // orderNo değerini orderBillingForm içindeki orderNo alanına ata
            // Diğer form alanlarını buraya ekleyin ve gerekli değerleri atayın
          });
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }
  deleteRow(index: number) {
    this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
  }
  orderNo: string = '';

  onModelChanged(value: string) {
    this.orderNo = value;
    this.getOrdersProduct(value);
  }
  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  formGenerator(orderNo: string, totalValue: number) {
    this.orderBillingForm = this.formBuilder.group({
      orderNo: [orderNo, Validators.required],
      totalValue: [totalValue, Validators.required],
      discount1: ['', Validators.required],
      discount2: ['', Validators.required],
      paymentType: ['', Validators.required],
      official_informal: ['', Validators.required],
    });
  }
  onSubmit(barcodeAddModel: BarcodeAddModel) {
    this.spinnerService.show();

    if (this.orderBillingForm.valid) {
      //this.orderService.addProductToOrder(barcodeAddModel);
      this.alertifyService.success('Sipariş Faturalandırma İşlemi Tamamlandı!');
      console.log(barcodeAddModel);
      setTimeout(() => {
        this.spinnerService.hide();
      }, 2000);

      // } else {
      //   this.alertifyService.error('Formu doldurunuz');
      //   console.log(barcodeAddModel);
      // }
    }

    window.location.reload();
  }
}
