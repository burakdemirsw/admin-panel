import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShelfModel } from 'src/app/models/model/shelf/ShelfModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { ShelfService } from 'src/app/services/admin/shelf.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-shelve-operation',
  templateUrl: './shelve-operation.component.html',
  styleUrls: ['./shelve-operation.component.css'],
})
export class ShelveOperationComponent implements OnInit {
  activeTab: number = 1;
  shelves: ShelfModel[] = [];
  shelvesForm: FormGroup;
  isDisabled: boolean = true;
  packageId: string = '';
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private shelfService: ShelfService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.spinnerService.show();
      this.getShelfDetail(params['id']);
      this.formGenerator();
      setTimeout(() => {
        this.spinnerService.hide();
      }, 1000);
    });
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
      this.packageId = generatedGUID.toString();
      this.shelvesForm.patchValue({
        packageId: this.packageId,
      });
      this.alertifyService.success('Qr Kod Oluşturuldu!');
    } catch (error) {
      console.error(error);
      this.alertifyService.error('Qr Kod Oluşturulurken bir hata oluştu!');
    }
  }

  onModelChanged(value: string) {
    this.getShelfByQrDetail(value);
  }

  formGenerator() {
    this.shelvesForm = this.formBuilder.group({
      qrString: [
        this.shelfModel?.qrString == '' ? '' : this.shelfModel.qrString,
      ],
      warehouse: [this.shelfModel?.warehouse, Validators.required],
      shelfNo: [this.shelfModel?.shelfNo, Validators.required],
      itemCode: [this.shelfModel?.itemCode, Validators.required],
      party: [this.shelfModel?.party, Validators.required],
      inventory: [this.shelfModel?.inventory, Validators.required],
      packageId: [this.shelfModel?.packageId, Validators.required],
    });
  }

  onSubmit(shelfModel: ShelfModel) {
    this.spinnerService.show();
    if (this.shelvesForm.valid) {
      this.shelfService.createShelf(shelfModel);
      this.alertifyService.success('Ürün isteği yolladı');

      console.log(shelfModel);
    } else {
      this.alertifyService.error('Formu doldurunuz');
      console.log(shelfModel);
    }

    this.spinnerService.hide();
  }
  shelfModel: ShelfModel = new ShelfModel();
  shelfModelList: ShelfModel[]=[]

  deleteRow(index: number) {
    this.shelfModelList.splice(index, 1); // İlgili satırı listeden sil
  }
  clearAllList(){
    this.shelfModelList.splice(0); // Tüm elemanları sil
    this.spinnerService.show();
    this.shelvesForm.reset();
    setTimeout(() => {
      this.spinnerService.hide();
      this.alertifyService.success('NEBIME BAŞARIYLA AKTARILDI!');
    }, 2000);
    
  }




  getShelfDetail(id: string): any {
    //apiden gerekli fonksiyonlar kurulcak

    try {
      this.httpClientService
        .get<ShelfModel>({
          controller: 'Shelves/' + id,
        })
        .subscribe((data) => {
          //console.log(data);
          this.shelves = data;
          this.shelfModel = data[0];
          this.formGenerator();
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  addToList(formValue: ShelfModel) {
    const shelfModel: ShelfModel = {
      id: 0,
      qrString: formValue.qrString || '', // Özelliği kontrol et ve undefined ise boş bir dize ata
      warehouse: formValue.warehouse || '',
      shelfNo: formValue.shelfNo || '',
      itemCode: formValue.itemCode || '',
      party: formValue.party || '',
      inventory: formValue.inventory || 1, // Özelliği kontrol et ve undefined ise 0 ata
      packageId: formValue.packageId || 0 // Özelliği kontrol et ve undefined ise 0 ata
    };
    try {
      const isDuplicate = this.shelfModelList.some(item =>
        item.qrString === shelfModel.qrString &&
        item.warehouse === shelfModel.warehouse &&
        item.shelfNo === shelfModel.shelfNo &&
        item.itemCode === shelfModel.itemCode &&
        item.party === shelfModel.party &&
        item.inventory === shelfModel.inventory &&
        item.packageId === shelfModel.packageId
      );
    
      if (isDuplicate) {
        const confirmResult = window.confirm('Bu ürün zaten listede var! Yine de eklemek istiyor musunuz?');
        if (confirmResult) {
          this.shelfModelList.push(shelfModel);
          this.alertifyService.success('Ürün Başarıyla Eklendi!');
          // Formu sıfırla
          // this.warehouseForm.reset();
        } else {
          // Kullanıcı "Hayır" dediğinde yapılacak işlemler
        }
      } else {
        this.shelfModelList.push(shelfModel);
        this.alertifyService.success('Ürün Başarıyla Eklendi!');
        // Formu sıfırla
        // this.warehouseForm.reset();
      }
    } catch (error: any) {
      this.alertifyService.alert(error.toString() + ' Bir hata oluştu', 'Hata Alındı');
    }
    
  }
  getShelfByQrDetail(id: string): any {
    //apiden gerekli fonksiyonlar kurulcak

    try {
      this.httpClientService
        .get<ShelfModel>({
          controller: 'Shelves/qr/' + id,
        })
        .subscribe((data) => {
          //console.log(data);
          this.shelves = data;
          this.shelfModel = data[0];
          this.formGenerator();
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
