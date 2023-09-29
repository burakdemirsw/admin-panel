import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { CountProductRequestModel2 } from 'src/app/models/model/order/countProductRequestModel2';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { ShelfModel } from 'src/app/models/model/shelf/ShelfModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-warehosue-shelf-count',
  templateUrl: './warehosue-shelf-count.component.html',
  styleUrls: ['./warehosue-shelf-count.component.css'],
})
export class WarehosueShelfCountComponent implements OnInit {
  [x: string]: any;

  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  currentOrderNo: string = '';
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private httpClient: HttpClient,
    private productService: ProductService,
    private generalService: GeneralService,
    private warehouseService: WarehouseService
  ) {}
  shelfNumbers: string = 'RAFLAR:';
  async ngOnInit() {
    this.formGenerator();

    this.currentOrderNo = await this.generalService.generateGUID();
    this.alertifyService.success(this.currentOrderNo);
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
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];

  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: ['', Validators.required],
      shelfNo: ['', Validators.required],
      qty: [''],
      office: ['', Validators.required],
      batchCode: [''],
      warehouseCode: ['', Validators.required],
    });
  }
  getSelectedOffice(from: number) {
    if (from == 1) {
      this.getWarehouseList(this.checkForm.get('office')?.value, 1);
    } else {
      this.getWarehouseList(this.checkForm.get('office')?.value, 2);
    }
  }
  getWarehouseList(value: string, from: number): any {
    try {
      if (from === 1) {
        const selectElement = document.getElementById(
          'office'
        ) as HTMLSelectElement;

        value = selectElement.value == '' ? 'M' : selectElement.value;
        this.httpClientService
          .get<WarehouseOfficeModel>({
            controller: 'Warehouse/GetWarehouseModel/' + value,
          })
          .subscribe((data) => {
            this.warehouseModels = data;
          });
      } else {
        const selectElement = document.getElementById(
          'officeTo'
        ) as HTMLSelectElement;

        value = selectElement.value == '' ? 'M' : selectElement.value;
        this.httpClientService
          .get<WarehouseOfficeModel>({
            controller: 'Warehouse/GetWarehouseModel/' + value,
          })
          .subscribe((data) => {
            this.warehouseModels2 = data;
          });
      }
    } catch (error: any) {
      //console.log(error.message);
    }
  }

  list: CountProductRequestModel2[] = [];
  totalCount: number = 0;
  calculateTotalQty() {
    this.alertifyService.success('Ürün Başarıyla Sayıldı.');
    let totalQty = 0;
    this.list.forEach((item) => {
      totalQty += item.qty;
    });
    this.totalCount = totalQty;
  }
  async countProductRequest(
    barcode: string,
    shelfNo: string,
    qty: number,
    office: string,
    warehouseCode: string,
    batchCode: string,

    url: string
  ): Promise<ProductCountModel> {
    var requestModel: CountProductRequestModel2 =
      new CountProductRequestModel2();
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.qty = qty.toString() == '' ? 1 : qty;
    requestModel.office = office;
    requestModel.warehouseCode = warehouseCode;
    requestModel.batchCode = batchCode;

    var response = await this.httpClient
      .post<ProductCountModel | undefined>(url, requestModel)
      .toPromise();

    return response;
  }
  async setShelfNo(barcode: string) :Promise<string>{
    this.shelfNumbers = 'RAFLAR:';

    if (barcode.length > 20) {
      var result : string[]= await this.productService.countProductByBarcode(
        barcode
      );
      this.shelfNumbers += result[0];
      return result[1];
    }else{
      this.checkForm.get('barcode').setValue('');
      this.focusNextInput('shelfNo');
      return null;
    }

  }

  async onSubmit(
    countProductRequestModel: CountProductRequestModel2
  ): Promise<any> {
    if (countProductRequestModel.qty.toString() === '') {
      countProductRequestModel.qty = 1;
    }
    if (!this.checkForm.valid) {
      if (countProductRequestModel.barcode) {
        var number = await this.setShelfNo(countProductRequestModel.barcode);
        this.checkForm.get("qty").setValue(Number(number));
      } else {
        this.alertifyService.warning('Barkod Alanı Boş.');
      }
      return;
    } else {
      const url = ClientUrls.baseUrl + '/Order/CountProduct3';

      try {
        var response: ProductCountModel =
          await this.warehouseService.countProductRequest(
            countProductRequestModel.barcode,
            countProductRequestModel.shelfNo,
            countProductRequestModel.qty,
            countProductRequestModel.office,
            countProductRequestModel.warehouseCode,
            countProductRequestModel.batchCode,
            'Order/CountProduct3',
            this.currentOrderNo
          );

        if (response != undefined) {
          var data: ProductCountModel = response;

          this.list.push(countProductRequestModel);

          this.calculateTotalQty();
          this.generalService.beep();
          this.clearQrAndBatchCode();

          if (data.status == 'RAF') {
            countProductRequestModel.shelfNo = response.description;
          } else {
            countProductRequestModel.barcode = response.description;
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }

  async check() {
    await this.onSubmit(this.checkForm.value);
  }

  enableBarcodeInput() {
    this.checkForm.get('barcode')?.enable();
  }
  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue('');
    this.focusNextInput('barcode');
    this.checkForm.get('qty').setValue('');

  }
  clearQrAndBatchCode() {
    this.checkForm.get('barcode').setValue('');
    this.checkForm.get('batchCode').setValue('');
    this.focusNextInput('barcode');
  }
  completeCount() {
    this.generalService.waitAndNavigate('Sayım Tamamlandı!', '/dashboard');
  }
}
