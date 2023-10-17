import { OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModel } from 'src/app/models/model/product/barcodeModel';
import { WarehouseModel } from 'src/app/models/model/warehouse/warehouseModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { TransferModel } from 'src/app/models/model/warehouse/transferModel';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
declare var window: any;

@Component({
  selector: 'app-warehouse-operation',
  templateUrl: './warehouse-operation.component.html',
  styleUrls: ['./warehouse-operation.component.css'],
})
export class WarehouseOperationComponent implements OnInit {
  currentOrderNo: string = '';
  activeTab: number = 1;
  warehoseModel: WarehouseModel[];
  warehouseForm: FormGroup;
  isDisabled: boolean = true;
  qrCode: string = null;

  currentBarcode: string = null;
  warehousePackageDetails: WarehouseModel[] = [];
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private generalService: GeneralService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private title: Title,
    private httpClient : HttpClient
  ) {}// Add this line
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];
  barcodeModel: BarcodeModel = new BarcodeModel();
  shelfNo: string = null;
  colorCode: string = null;
  itemDim1Code: string = null;
  itemCode: string = null;
  batchCode: string;
  officeModels: OfficeModel[] = [];
  async ngOnInit() {
    this.spinnerService.show();
    this.activatedRoute.params.subscribe(async (params) => {

      this.currentOrderNo = 'TP-' + params["number"];
      await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);

      this.spinnerService.hide();
    });
    this.formGenerator();
    

  //  await this.getOfficeCodeList();
  

  }

  modalImageUrl: string;
  formModal: any;
  openImageModal(imageUrl: string) {
    this.modalImageUrl = imageUrl;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }
    this.formModal.show();
  }


 formGenerator() {
    try {
      this.warehouseForm = this.formBuilder.group({
        id: [null],
        shelfNo: [this.shelfNo, Validators.required],
        barcode: [this.currentBarcode, Validators.required],
        quantity: [null, Validators.required],
        batchCode: [this.batchCode],
        office: [null, Validators.required],
        officeTo: [null, Validators.required],
        warehouse: [null, Validators.required],
        warehouseTo: [null, Validators.required],
        orderNo: [this.currentOrderNo],
      });


    } catch (error) {
      console.error(error);
      // Handle the error as needed.
    }
  }

  async getOfficeCodeList(): Promise<any> {
    try {
      const response = await this.httpClientService
        .get<OfficeModel>({
          controller: 'Warehouse/GetOfficeModel',
        })
        .toPromise();
      this.officeModels = response;
    } catch (error: any) {
      //console.log(error.message);
    }
  }
  async getSelectedOffice(from: number): Promise<any> {
    if (from == 1) {
      await this.getWarehouseList(this.warehouseForm.get('office')?.value, 1);
      
    } else {
      await this.getWarehouseList(this.warehouseForm.get('officeTo')?.value, 2);
    }
  }

  async getWarehouseList(value: string, from: number): Promise<any> {
    try {
      if (from === 1) {
        const selectElement = document.getElementById(
          'office'
        ) as HTMLSelectElement;

        value = selectElement.value == '' ? 'M' : selectElement.value;
        const response = await this.httpClientService
        .get<WarehouseOfficeModel>({
          controller: 'Warehouse/GetWarehouseModel/' + value,
        })
        .toPromise();

      if (response) {
        this.warehouseModels.push(response[0]);

        this.warehouseForm
          .get('warehouse')
          .setValue(response[0].warehouseCode);
        const selectedValue2 = this.warehouseForm.get('warehouse').value;

        console.clear()
      console.log('Form Değeri (warehouseCode) \n' + selectedValue2); //null geliyor
        return true;
      } else {
        this.alertifyService.error('Depo Çekilemedi');
        return false;
      }
      } else {
        const selectElement = document.getElementById(
          'officeTo'
        ) as HTMLSelectElement;

        value = selectElement.value == '' ? 'M' : selectElement.value;
        const response = await this.httpClientService
        .get<WarehouseOfficeModel>({
          controller: 'Warehouse/GetWarehouseModel/' + value,
        })
        .toPromise();

      if (response) {
        this.warehouseModels2.push(response[0]);

        this.warehouseForm
          .get('warehouseTo')
          .setValue(response[0].warehouseCode);
        const selectedValue2 = this.warehouseForm.get('warehouseTo').value;
        console.clear()
        console.log('Form Değeri (warehouseTo) \n' + selectedValue2); //null geliyor
        return true;
      } else {
        this.alertifyService.error('Depo Çekilemedi');
        return false;
      }
      }
    } catch (error: any) {
      //console.log(error.message);
    }
  }

  onModelChanged(value: string) {
    this.getShelfByQrDetail(value);
  }

  async transferToNebim(currentOrderNo: string) {
    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(this.currentOrderNo+' numaralı sipariş için İşlemi başlatmak istediğinize emin misiniz?');
  
      if (userConfirmed) {
        try {
          const data = await this.httpClientService
            .get<any>({ controller: 'Warehouse/TransferProducts/' + currentOrderNo })
            .toPromise();
  
          if (data) {
            // Başarılı yanıt geldiğinde console'a başarılı yazısı yazdır
        
            this.generalService.waitAndNavigate(
              'Transfer İşlemi Başarıyla Gerçekleşti.',
              'dashboard'
            );
          }
        } catch (error: any) {
          console.log(error.message);
        }
      } else {
        this.alertifyService.warning('İşlem iptal edildi.');
      }
    } else {
      this.alertifyService.warning('Sipariş No Boş Geliyor.');
    }
  }
  
  changePage() {
    setTimeout(() => {
      this.router.navigate(['/warehouse-operation-confirm']);
    }, 2000);
  }

  barcode: string = null;

  warehouseTransferForms: TransferModel[] = [];

  async setShelfNo(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode) {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );
      this.shelfNumbers += result[0];
      return result[1];
    } else {
      this.alertifyService.warning('Barkod Alanı Boş.');
      return null;
    }
  }

  async onSubmit(formValue: any ): Promise<any> {
    if (!this.warehouseForm.valid) {
      if (formValue.barcode) {
        var number = await this.setShelfNo(formValue.barcode);
        this.warehouseForm.get('quantity')?.setValue(Number(number));
        this.alertifyService.success(
          'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
        );
      } else {
        this.alertifyService.warning('Barkod Alanı Boş.');
      }

      return;
    } else if(this.warehouseForm.valid) {


      var newResponse = await this.productService.countProductByBarcode(
        formValue.barcode
      );

      const shelves = newResponse[0]
        .split(',')
        .filter((raflar) => raflar.trim() !== '');

      if (shelves.includes(formValue.shelfNo)) {
        var response = await this.productService.countTransferProduct(
          formValue
        );

          if (response != undefined) {
          var data: ProductCountModel = response;
          if (data.status == 'RAF') {
            formValue.shelfNo = response.description;
          } else {
            formValue.barcode = response.description;
          }

          const parcalanmisVeri = this.shelfNumbers.split(':');
          const raflarKismi = parcalanmisVeri[1];
          const raflar = raflarKismi
            .split(',')
            .filter((raflar) => raflar.trim() !== '');
          if (raflar.length > 0) {
            if (formValue.shelfNo.toLowerCase()) {
              formValue.quantity = Number(newResponse[1]);
              this.generalService.beep();
              await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
              this.calculateTotalQty();
              this.clearQrAndBatchCode();
            } else {
              if (confirm('Raf Bulunamadı! Eklensin mi(1)?')) {
                this.generalService.beep();

                var newResponse =
                  await this.productService.countProductByBarcode(
                    formValue.barcode
                  );
                formValue.quantity = Number(newResponse[1]);
                await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
                this.calculateTotalQty();
                this.clearQrAndBatchCode();
              } else {
                this.calculateTotalQty();
                this.alertifyService.warning('Ekleme Yapılmadı!');
              }
            }
          } else {
            formValue.quantity = Number(newResponse[1]);
            this.generalService.beep();

            await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
            this.calculateTotalQty();
            this.clearQrAndBatchCode();
          }
        }
      } else {
        if (
          confirm(
            'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
          )
        ) {
          var number = await this.setShelfNo(formValue.barcode);
          this.warehouseForm.get('quantity')?.setValue(Number(number));

          var response = await this.productService.countTransferProduct(
            formValue
          );

          if (response != undefined) {
            var data: ProductCountModel = response;
            if (data.status == 'RAF') {
              formValue.shelfNo = response.description;
            } else {
              formValue.barcode = response.description;
            }
            this.generalService.beep();
            formValue.quantity = Number(newResponse[1]);
            await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
            this.calculateTotalQty();
            this.clearQrAndBatchCode();
          }
        } else {
          var number = await this.setShelfNo(formValue.barcode);
          this.warehouseForm.get('quantity')?.setValue(Number(number));
          this.alertifyService.success(
            'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
          );
        }
      }
    }else{
      this.alertifyService.error("Form Geçersiz")
    }
  }

  async getProductOfCount(orderNo: string): Promise<any> {
    this.warehouseTransferForms =
      await this.warehouseService.getProductOfTrasfer(orderNo);
    this.calculateTotalQty();
  }

  totalCount: number;
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.warehouseTransferForms.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }

  clearQrAndBatchCode() {
    this.warehouseForm.get('barcode').setValue(null);
    this.warehouseForm.get('batchCode').setValue(null);
    //this.warehouseForm.get('quantity').setValue(null);

    this.focusNextInput('barcode');
  }
  resetForm() {
    this.warehouseForm.patchValue({
      shelfNo: null,
      barcode: null,
      batchCode: null,
      itemCode: null,
    });
    this.focusNextInput('shelfNo');
  }
  warehosueModel: WarehouseModel = new WarehouseModel();
  getShelfDetail(id: string): any {
    //apiden gerekli fonksiyonlar kurulcak

    try {
      this.httpClientService
        .get<WarehouseModel>({
          controller: 'Shelves/' + id,
        })
        .subscribe((data) => {
          ////console.log(data);
          this.warehoseModel = data;
          this.warehosueModel = data[0];
          this.formGenerator();
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  deleteRow(index: number) {
    this.warehouseTransferForms.splice(index, 1); // İlgili satırı listeden sil
  }

  clearAllList() {
    this.warehousePackageDetails.splice(0); // Tüm elemanları sil
    this.warehouseForm.reset();
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
      this.alertifyService.success('NEBIME BAŞARIYLA AKTARILDI!');
    }, 2000);
  }

  focusNextInput2() {
    this.onSubmit(this.warehouseForm.value);
  }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  getShelfByQrDetail(id: string): any {
    //apiden gerekli fonksiyonlar kurulcak

    try {
      this.httpClientService
        .get<WarehouseModel>({
          controller: 'Shelves/qr/' + id,
        })
        .subscribe((data) => {
          ////console.log(data);
          this.warehoseModel = data;
          this.warehosueModel = data[0];
          this.formGenerator();
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }
  shelfNumbers: string = 'RAFLAR:';
  clearShelfNumbers() {
    this.warehouseForm.get('shelfNo').setValue(null);
    this.warehouseForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'RAFLAR:';
    this.warehouseForm.get('quantity').setValue(null);
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
      this.warehouseTransferForms = this.warehouseTransferForms.filter(
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
