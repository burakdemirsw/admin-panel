import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel2 } from 'src/app/models/model/order/countProductRequestModel2';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CountedProduct } from 'src/app/models/model/product/countedProduct';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
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
    private warehouseService: WarehouseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  shelfNumbers: string = 'RAFLAR:';
  async ngOnInit() {
    this.formGenerator();
    this.activatedRoute.params.subscribe(async (params) => {
      this.currentOrderNo = params['orderNo'];
      await this.getProductOfCount(this.currentOrderNo);
    });
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
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null],
      office: [null, Validators.required],
      batchCode: [null],
      warehouseCode: [null, Validators.required],
      isShelfBased: [null],
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
  currentPage:number = 1;
  
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.lastCollectedProducts.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }
  lastCollectedProducts: CountedProduct[] = [];
  async getProductOfCount(orderNo: string): Promise<any> {
    this.lastCollectedProducts = await this.warehouseService.getProductOfCount(
      orderNo
    );
    this.calculateTotalQty();
  }

  async countProductRequest(
    barcode: string,
    shelfNo: string,
    quantity: number,
    office: string,
    warehouseCode: string,
    batchCode: string,

    url: string
  ): Promise<ProductCountModel> {
    var requestModel: CountProductRequestModel2 =
      new CountProductRequestModel2();
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.quantity = quantity.toString() == null ? 1 : quantity;
    requestModel.office = office;
    requestModel.warehouseCode = warehouseCode;
    requestModel.batchCode = batchCode;

    var response = await this.httpClient
      .post<ProductCountModel | undefined>(url, requestModel)
      .toPromise();

    return response;
  }

  async setShelfNo(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode.length > 10) {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );
      this.shelfNumbers += result[0];
      return result[1];
    } else {
      this.checkForm.get('barcode').setValue(null);
      this.focusNextInput('shelfNo');
      return null;
    }
  }

  async onSubmit(
    countProductRequestModel: CountProductRequestModel2
  ): Promise<any> {
    if (!this.checkForm.valid) {
      if (countProductRequestModel.barcode) {
        var number = await this.setShelfNo(countProductRequestModel.barcode);
        this.checkForm.get('quantity')?.setValue(Number(number)); //quantity alanı dolduruldu
        this.alertifyService.success(
          'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
        );
      } else {
        this.alertifyService.warning('Barkod Alanı Boş.');
      }
      return;
    } else {
      const url = ClientUrls.baseUrl + '/Order/CountProduct3';

      try {
        //tam bu alanda barkodu yolla eğer gönderilen raf gelen cevabın içinden çıkarsa say
  
        var newResponse = await this.productService.countProductByBarcode(
          countProductRequestModel.barcode
        );

        const shelves = newResponse[0]
        .split(',')
        .filter((raflar) => raflar.trim() !== '');

        if (shelves.includes(countProductRequestModel.shelfNo)) {
          var response: ProductCountModel =
            await this.warehouseService.countProductRequest(
              countProductRequestModel.barcode,
              countProductRequestModel.shelfNo,
              countProductRequestModel.quantity.toString().trim() == ''
                ? Number(newResponse[1])
                : countProductRequestModel.quantity,
              countProductRequestModel.office,
              countProductRequestModel.warehouseCode,
              countProductRequestModel.batchCode,
              'Order/CountProduct3',
              this.currentOrderNo,''
            );
          if (response != undefined) {
            var data: ProductCountModel = response;
            if (data.status == 'RAF') {
              countProductRequestModel.shelfNo = response.description;
            } else {
              countProductRequestModel.barcode = response.description;
            }

            const parcalanmisVeri = this.shelfNumbers.split(':');
            const raflarKismi = parcalanmisVeri[1];
            const raflar = raflarKismi
              .split(',')
              .filter((raflar) => raflar.trim() !== '');
            if (raflar.length > 0) {
              if (countProductRequestModel.shelfNo.toLowerCase()) {
                
                countProductRequestModel.quantity = Number(newResponse[1]);
                this.generalService.beep();
                await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
                this.calculateTotalQty();
                this.clearQrAndBatchCode();
              } else {
                if (confirm('Raf Bulunamadı! Eklensin mi(1)?')) {
                  this.generalService.beep();

                  var newResponse =
                    await this.productService.countProductByBarcode(
                      countProductRequestModel.barcode
                    );
                  countProductRequestModel.quantity = Number(newResponse[1]);
                  await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
                  this.calculateTotalQty();
                  this.clearQrAndBatchCode();
                } else {
                  this.calculateTotalQty();
                  this.alertifyService.warning('Ekleme Yapılmadı!');
                }
              }
            } else {
              countProductRequestModel.quantity = Number(newResponse[1]);
              this.generalService.beep();

              await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
              this.calculateTotalQty();
              this.clearQrAndBatchCode();
            }
          }
        } else 
        {
          if (
            confirm(
              'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
            )
          ) {
            var number = await this.setShelfNo(
              countProductRequestModel.barcode
            );
            this.checkForm.get('quantity')?.setValue(Number(number));

            var response: ProductCountModel =
              await this.warehouseService.countProductRequest(
                countProductRequestModel.barcode,
                countProductRequestModel.shelfNo,
                countProductRequestModel.quantity ===null
                ? Number(newResponse[1])
                : countProductRequestModel.quantity,
                countProductRequestModel.office,
                countProductRequestModel.warehouseCode,
                countProductRequestModel.batchCode,
                'Order/CountProduct3',
                this.currentOrderNo,''
              );

            if (response != undefined) {
              var data: ProductCountModel = response;
              if (data.status == 'RAF') {
                countProductRequestModel.shelfNo = response.description;
              } else {
                countProductRequestModel.barcode = response.description;
              }
              this.generalService.beep();
              countProductRequestModel.quantity = Number(newResponse[1]);
              await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
              this.calculateTotalQty();
              this.clearQrAndBatchCode();
            }
          } else {
            var number = await this.setShelfNo(
              countProductRequestModel.barcode
            );
            this.checkForm.get('quantity')?.setValue(Number(number));
            this.alertifyService.success(
              'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
            );
          }
        }
      } catch (error: any) {
        this.alertifyService.error(error.message);
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
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers='RAFLAR:'
    this.checkForm.get('quantity').setValue(null);
  }
  clearQrAndBatchCode() {
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.focusNextInput('barcode');
  }
  completeCount() {
    this.generalService.waitAndNavigate('Sayım Tamamlandı!', '/dashboard');
  }
  async completeCountFromService(orderNo: string): Promise<boolean> {
    const response = await this.productService.completeCount(
      this.currentOrderNo +
        '|' +
        (document.getElementById('isShelfBased') as HTMLInputElement).checked
    );
    if (response > 0) {
      this.router.navigate(['/warehouse-shelf-count-list']);
      
      return true;
    } else {
      return false;
    }
  }

  async deleteOrderProduct(
    orderNo: string,
    itemCode: string,
    shelfNo: string
  ): Promise<boolean> {
    const response: boolean = await this.productService.deleteOrderProduct(
      this.currentOrderNo,
      itemCode
    );
    if (response) {
      this.list = this.list.filter(
        (o) => !(o.barcode == itemCode && o.shelfNo == shelfNo)
      );
      this.calculateTotalQty();
      await this.getProductOfCount(this.currentOrderNo);
      this.alertifyService.success('Silme İşlemi Başarılı.');
    } else {
      this.alertifyService.error('Silme İşlemi Başarısız.');
    }
    return response;
  }
}
