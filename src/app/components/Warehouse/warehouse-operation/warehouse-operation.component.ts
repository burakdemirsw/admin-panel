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
import { GeneralService } from 'src/app/services/admin/general.service';
import { ProductService } from 'src/app/services/admin/product.service';

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
  qrCode: string = null;

  currentBarcode: string = null;
  warehousePackageDetails: WarehouseModel[] = [];
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private shelfService: ShelfService,
    private router: Router,
    private generalService : GeneralService,
    private productService : ProductService,

  ) {}
  selectedOffice: string; // Add this line
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];
  barcodeModel: BarcodeModel = new BarcodeModel();
  shelfNo: string = null;
  colorCode: string = null;
  itemDim1Code: string = null;
  itemCode: string = null;
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
        office: [null, Validators.required],
        officeTo: [null, Validators.required],
        warehouse: [null, Validators.required],
        warehouseTo: [null, Validators.required],
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

        value = selectElement.value == null ? 'M' : selectElement.value;
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

        value = selectElement.value == null ? 'M' : selectElement.value;
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

 
  generateAndSetGUID() {
    try {
      const generatedGUID = this.generalService.generateGUID();
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

  async transferToNebim(formValue: WarehouseFormModel[]) { //depo servise yolla bu fonksiyonu 

    if(formValue.length>0){
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

        this.generalService.waitAndNavigate("Transfer İşlemi Başarıyla Gerçekleşti.","warehouse-operation-confirm")
       
      } catch (error: any) {
        console.log(error.message);
      }
    }else{
      this.alertifyService.warning("Liste Boş Geliyor.")
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

  barcode: string = null;

  async getProductByBarcode(value: string): Promise<boolean> { //geriye WarehouseFormModel dönücek şekilde ayarla
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

  async setShelfNo(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode.length > 10) {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );
      this.shelfNumbers += result[0];
      return result[1];
    } else {
      this.warehouseForm.get('barcode').setValue(null);
      this.focusNextInput('shelfNo');
      return null;
    }
  }

  async onSubmit(formValue: WarehouseFormModel): Promise<any> {
    if (formValue.shelfNo ==null || formValue.shelfNo.trim() === '') {

      if (formValue.barcode) {
        var number = await this.setShelfNo(formValue.barcode);
        this.warehouseForm.get('quantity')?.setValue(Number(number)); 
        this.alertifyService.success(
          'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
        );
      } else {
        this.alertifyService.warning('Barkod Alanı Boş.');
      }

  
      //bu alanda rafları altına yazdır ++
      //bu alanda miktar alanını altına yazdır++

      return;
    }


    // bu alanda geriye bool yerine bir model al ve şimdiki formValue ile eşitle (form değerlerinden almak yerine)-
    var statusB: boolean = await this.getProductByBarcode(formValue.barcode); 

    // bu alanda buradan eklemek yerine sql e WarehouseFormModel tablosu oluştur ve o tablodan verileri çek --
    const existingItem = this.warehouseTransferForms.find(
      (item) =>
        item.shelfNo === formValue.shelfNo && item.barcode === this.warehouseForm.get("barcode").value
    );

     // bu alanda eğer form valid ise ekleme işlemi yapılcak --

    if (statusB) { //eğer barkod ve item Code alanları dolduysa --
      

      // bu alanda eğer barkod raf doğrulaması yapılcak  bu alandan geçerse ekleme yapılcak --
        if (existingItem) {

          existingItem.inventory += Number(formValue.inventory);

          this.alertifyService.success('Stok Miktarı Güncellendi!');
          
          this.warehouseForm.patchValue({
            shelfNo: null,
            barcode: null,
          });

          this.focusNextInput('shelfNo');

          this.generalService.beep()
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
              formValue.itemDim1Code == null ? null : formValue.itemDim1Code,
          };
         

          try {
            this.warehouseTransferForms.push(newWarehousePackageDetail);
            this.alertifyService.success('Ürün Başarıyla Eklendi!');
            this.generalService.beep()
            this.resetForm();
       
           
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
      shelfNo: null,
      barcode: null,
      party: null,
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
    this.shelfNumbers='RAFLAR:'
    this.warehouseForm.get('quantity').setValue(null);
  }
  
}
