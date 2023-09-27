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
  ) {}
  selectedOffice: string; // Add this line
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];
  barcodeModel: BarcodeModel = new BarcodeModel();
  shelfNo: string = '';
  colorCode: string = '';
  itemDim1Code: string = '';
  itemCode: string = '';
  party: string;
  officeModels: OfficeModel[] = [];
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.spinnerService.show();
      this.getOfficeCodeList();
      this.getWarehouseList('M', 1);
      this.getWarehouseList('M', 2);

      // this.getShelfDetail(params['id']);
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

  async transferToNebim(formValue: WarehouseFormModel[]) {
    try {
      const data = await this.httpClientService
        .post<WarehouseFormModel[]>(
          {
            controller: 'Warehouse/TransferProducts',
          },
          formValue
        )
        .toPromise();
  
      // Başarılı yanıt geldiğinde console'a başarılı yazısı yazdır
      this.alertifyService.success('Transfer Başarılı');
  
      // 2 saniye bekledikten sonra sayfayı değiştir
      setTimeout(() => {
        this.router.navigate(['/warehouse-operation-confirm']);
      }, 2000);
    } catch (error: any) {
      console.log(error.message);
    }
  }
  changePage(){
    setTimeout(() => {
      this.router.navigate(['/warehouse-operation-confirm']);
    }, 2000);
  }

  getProductDetailandSkipFocus() {
    // bu kısımda ilgili veriyi çekip yerine yazıyoruz
    const selectElement = document.getElementById(
      'barcode'
    ) as HTMLSelectElement;
    this.getProductByBarcode(selectElement.value);
  }

  barcode: string = '';

  async getProductByBarcode(value: string): Promise<boolean> {
    try {
      const data = await this.httpClientService
        .get<BarcodeModel>({
          controller: 'Warehouse/GetBarcodeDetail/' + value,
        })
        .toPromise();

      this.barcodeModel = Object.assign(new BarcodeModel(), data[0]);
      this.currentBarcode = value;
      this.shelfNo = this.barcodeModel.shelfNo;
      this.colorCode = this.barcodeModel.colorCode;
      this.itemDim1Code = this.barcodeModel.itemDim1Code;
      this.itemCode = this.barcodeModel.itemCode;
      this.party = this.barcodeModel.party;
      this.barcode = this.barcodeModel.barcode;

      // Warehouse formunu güncelle
      this.warehouseForm.patchValue({
        itemCode: this.itemCode,
        party: this.party,
        colorCode: this.colorCode,
        barcode: this.barcode,
      });
      this.alertifyService.success('Form Doldurma İşlemi Başarılı!');

      // Diğer işlemleri burada yapabilirsiniz
      // Örneğin:
      if (this.barcodeModel.itemCode) {
        //this.onSubmit(this.warehouseForm.value);
        this.alertifyService.success('Submit Fonksiyonuna Gönderildi');

        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.log(error.message);
      return false;
    }
    return false;
  }

  warehouseTransferForms: WarehouseFormModel[] = [];

  async onSubmit(formValue: WarehouseFormModel): Promise<any> {
    if (!formValue.shelfNo || formValue.shelfNo.trim() === '') {
      this.alertifyService.error('Raf No alanı boş olamaz!');
      return;
    }

  
    //bu kısımda doğrulama yapılcak eğer barkod ve raf oyuşuyorsa devam edilcek
    var statusB: boolean = await this.getProductByBarcode(formValue.barcode);
    const existingItem = this.warehouseTransferForms.find(
      (item) =>
        item.shelfNo === formValue.shelfNo && item.barcode === this.warehouseForm.get("barcode").value
    );
    if (statusB) { //eğer barkod ve item Code alanları dolduysa 
      
        if (existingItem) {

          existingItem.inventory += Number(formValue.inventory);

          this.alertifyService.success('Stok Miktarı Güncellendi!');
          
          this.warehouseForm.patchValue({
            shelfNo: '',
            barcode: '',
          });

          this.focusNextInput('shelfNo');

          const audio = new Audio('assets/music/scanner.mp3');
          audio.play();
        } else {
          const newWarehousePackageDetail: WarehouseFormModel = {
            id: formValue.id,
            shelfNo: formValue.shelfNo,
            barcode: this.warehouseForm.get("barcode").value,
            inventory: formValue.inventory == null ? 1 : formValue.inventory,
            party: this.warehouseForm.get("party").value,
            itemCode: this.warehouseForm.get("itemCode").value,
            office: formValue.office,
            officeTo: formValue.officeTo,
            warehouse: (
              document.getElementById('warehouse') as HTMLInputElement
            ).value,
            warehouseTo: (
              document.getElementById('warehouseTo') as HTMLInputElement
            ).value,
            colorCode:this.warehouseForm.get("colorCode").value,
            itemDim1Code:
              formValue.itemDim1Code == '' ? '' : formValue.itemDim1Code,
          };
          //console.log(newWarehousePackageDetail);

          try {
            this.warehouseTransferForms.push(newWarehousePackageDetail);
            this.alertifyService.success('Ürün Başarıyla Eklendi!');
            this.resetForm();
            this.focusNextInput('shelfNo');
            const audio = new Audio('assets/music/scanner.mp3');
            audio.play();
          } catch (error: any) {
            this.alertifyService.alert(
              error.toString() + ' Bir hata oluştu',
              'Hata Alındı'
            );
          }
        }
      
    }else{
      var statusB: boolean = await this.getProductByBarcode(formValue.barcode);
      if (statusB) { //eğer barkod ve item Code alanları dolduysa 
        this.onSubmit(this.warehouseForm.value);
      }  
    }
  }
  resetForm() {
    this.warehouseForm.patchValue({
      shelfNo: '',
      barcode: '',
      party: '',
      itemCode: '',
    });
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
