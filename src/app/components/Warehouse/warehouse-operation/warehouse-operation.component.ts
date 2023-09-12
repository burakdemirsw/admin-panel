import { OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModel } from 'src/app/models/model/product/barcodeModel';
import { WarehouseModel } from 'src/app/models/model/warehouse/warehouseModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseFormModel } from 'src/app/models/model/warehouse/warehosueTransferModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { ShelfService } from 'src/app/services/admin/shelf.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { ClientUrls } from 'src/app/models/const/ClientUrls';

@Component({
  selector: 'app-warehouse-operation',
  templateUrl: './warehouse-operation.component.html',
  styleUrls: ['./warehouse-operation.component.css'],
})
export class WarehouseOperationComponent implements OnInit {
  activeTab: number = 1;
  warehoseModel: WarehouseModel[];
  warehouseForm: FormGroup;
  isDisabled: boolean = true;
  qrCode: string = '';

  currentBarcode: string = '';
  warehousePackageDetails: WarehouseModel[] = [];
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private shelfService: ShelfService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.spinnerService.show();
      this.getOfficeCodeList();
      this.getWarehouseList('M', 1);
      this.getWarehouseList('M', 2);

      this.getShelfDetail(params['id']);
      this.formGenerator();
      setTimeout(() => {
        this.spinnerService.hide();
      }, 1000);
    });
  }
  formGenerator() {
    try {
      this.warehouseForm = this.formBuilder.group({
        id: [0, Validators.required],
        shelfNo: [this.shelfNo, Validators.required],
        barcode: [this.currentBarcode, Validators.required],
        inventory: [1, Validators.required],
        colorCode: [this.colorCode, Validators.required],
        itemDim1Code: [this.itemDim1Code, Validators.required],
        party: [this.party, Validators.required],
        itemCode: [this.itemCode, Validators.required],
        office: ['', Validators.required],
        officeTo: ['', Validators.required],
        warehouse: ['', Validators.required],
        warehouseTo: ['', Validators.required],
      });
    } catch (error: any) {
      alert(error.message);
    }
  }

  officeModels: OfficeModel[] = [];

  getOfficeCodeList(): any {
    try {
      this.httpClientService
        .get<OfficeModel>({
          controller: 'Warehouse/GetOfficeModel',
        })
        .subscribe((data) => {
          ////console.log(data);
          this.officeModels = data;
        });
    } catch (error: any) {
      //console.log(error.message);
    }
  }
  getSelectedOffice(from: number) {
    if (from == 1) {
      this.getWarehouseList(this.warehouseForm.get('office')?.value, 1);
    } else {
      this.getWarehouseList(this.warehouseForm.get('office')?.value, 2);
    }
  }

  selectedOffice: string; // Add this line
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];

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

  generateGUID(): string {
    function generateUUID() {
      let dt = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }

    return generateUUID();
  }
  generateAndSetGUID() {
    try {
      const generatedGUID = this.generateGUID();
      this.qrCode = generatedGUID.toString();
      this.warehouseForm.patchValue({
        qrString: this.qrCode,
      });
      this.alertifyService.success('Qr Kod Oluşturuldu!');
    } catch (error) {
      console.error(error);
      this.alertifyService.error('Qr Kod Oluşturulurken bir hata oluştu!');
    }
  }
  //s4185
  onModelChanged(value: string) {
    this.getShelfByQrDetail(value);
  }

  transferToNebim(formValue: WarehouseFormModel[]) {
    debugger;
    formValue.forEach((f) => {
      try {
        this.httpClientService
          .post<WarehouseFormModel>(
            {
              controller: 'Warehouse/TransferProducts',
            },
            f
          )
          .subscribe((data) => {
            //console.log(data);
          });
      } catch (error: any) {
        console.log(error.message);
      }
    });

    this.router.navigate(['/warehouse-operation-confirm']);
  }
  
  barcodeModel: BarcodeModel = new BarcodeModel();
  shelfNo: string = '';
  colorCode: string = '';
  itemDim1Code: string = '';
  itemCode: string = '';
  party: string;
  getProductDetailandSkipFocus() {
    // bu kısımda ilgili veriyi çekip yerine yazıyoruz
    const selectElement = document.getElementById(
      'barcode'
    ) as HTMLSelectElement;
    this.getProductByBarcode(selectElement.value);
  }

  barcode: string = '';

  getProductByBarcode(value: string): any {
    try {
      this.httpClientService
        .get<BarcodeModel>({
          controller: 'Warehouse/GetBarcodeDetail/' + value,
        })
        .subscribe((data) => {
          this.barcodeModel = Object.assign(new BarcodeModel(), data[0]);
          this.currentBarcode = value;
          this.shelfNo = this.warehouseForm.get('shelfNo')?.value;
          this.colorCode = this.barcodeModel.colorCode;
          this.itemDim1Code = this.barcodeModel.itemDim1Code;
          this.itemCode = this.barcodeModel.itemCode;
          this.party = this.barcodeModel.party;
          this.barcode = this.barcodeModel.barcode;
          // Warehouse formunu güncelle
          this.warehouseForm.patchValue({
            itemCode: this.itemCode,
            party: this.party,
            shelfNo: this.shelfNo,
            barcode: this.barcode,
          });

          if (this.itemCode != '') {
            this.onSubmit(this.warehouseForm.value); // Input değerleri doluysa onSubmit fonksiyonunu çağır
          }
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  warehouseTransferForms: WarehouseFormModel[] = [];

  onSubmit(formValue: WarehouseFormModel) {
    if (!formValue.shelfNo || formValue.shelfNo.trim() === '') {
      this.alertifyService.error('Raf No alanı boş olamaz!');
      return;
    }

    const existingItem = this.warehouseTransferForms.find(
      (item) =>
        item.shelfNo === formValue.shelfNo && item.barcode === formValue.barcode
    );

    if (existingItem) {
      // Aynı raf no ve barcode değerine sahip bir öğe var, stok miktarını artır
      existingItem.inventory += formValue.inventory || 0;
      this.alertifyService.success('Stok Miktarı Güncellendi!');
      this.warehouseForm.patchValue({
        shelfNo: '',
        barcode: '',
      });
      this.focusNextInput('shelfNo');
      // JavaScript
      const audio = new Audio('assets/music/scanner.mp3');
      audio.play();
    } else {
      const newWarehousePackageDetail: WarehouseFormModel = {
        id: formValue.id,
        shelfNo: formValue.shelfNo,
        barcode: formValue.barcode,
        inventory: formValue.inventory || 0,
        party: formValue.party,
        itemCode: formValue.itemCode,
        office: formValue.office,
        officeTo: formValue.officeTo,
        warehouse: (document.getElementById('warehouse') as HTMLInputElement)
          .value,
        warehouseTo: (
          document.getElementById('warehouseTo') as HTMLInputElement
        ).value,
        colorCode: formValue.colorCode == '' ? '' : formValue.colorCode,
        itemDim1Code:
          formValue.itemDim1Code == '' ? '' : formValue.itemDim1Code,
      };
      //console.log(newWarehousePackageDetail);

      try {
        this.warehouseTransferForms.push(newWarehousePackageDetail);
        this.alertifyService.success('Ürün Başarıyla Eklendi!');
        this.warehouseForm.patchValue({
          shelfNo: '',
          barcode: '',
        });
        this.focusNextInput('shelfNo');
        // JavaScript
        const audio = new Audio('assets/music/scanner.mp3');
        audio.play();
      } catch (error: any) {
        this.alertifyService.alert(
          error.toString() + ' Bir hata oluştu',
          'Hata Alındı'
        );
      }
    }
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
}
