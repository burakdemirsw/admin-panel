import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShelfModel } from 'src/app/models/model/ShelfModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { ShelfService } from 'src/app/services/admin/shelf.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-shelve-operation',
  templateUrl: './shelve-operation.component.html',
  styleUrls: ['./shelve-operation.component.css']
})
export class ShelveOperationComponent implements OnInit {
  activeTab:number=1;
  shelves : ShelfModel[];
  shelvesForm : FormGroup;
  isDisabled: boolean = true;
  qrCode  : string ="";
  constructor( private httpClientService : HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute : ActivatedRoute,
    private spinnerService : NgxSpinnerService,
    private shelfService:  ShelfService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      this.spinnerService.show();
      this.getShelfDetail(params["id"]);
      this.formGenerator();
      setTimeout(() => {
        this.spinnerService.hide();
      }, 1000);
    })

  }
  generateGUID(): string {
    function generateUUID() {
      let dt = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    }
  
    return generateUUID();
  }
  generateAndSetGUID() {
    try {
        const generatedGUID = this.generateGUID();
        this.qrCode = generatedGUID.toString();
        this.shelvesForm.patchValue({
          qrString: this.qrCode
        });
        this.alertifyService.success("Qr Kod Oluşturuldu!");
    } catch (error) {
        console.error(error);
        this.alertifyService.error("Qr Kod Oluşturulurken bir hata oluştu!");
    }
}

onModelChanged(value: string) {

    this.getShelfDetail(value);
  
}


  formGenerator() {
    this.shelvesForm = this.formBuilder.group({
      qrString : [this.shelfModel.qrString == "" ? "" : this.shelfModel.qrString ],   
      warehouse: [this.shelfModel?.warehouse, Validators.required],
      shelfNo: [this.shelfModel?.shelfNo, Validators.required],
      itemCode: [this.shelfModel?.itemCode, Validators.required],
      party: [this.shelfModel?.party, Validators.required],
      inventory: [this.shelfModel?.inventory, Validators.required]
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
  shelfModel : ShelfModel = new ShelfModel();
  getShelfDetail(id: string): any { //apiden gerekli fonksiyonlar kurulcak

    try {
      this.httpClientService
        .get<ShelfModel>({
          controller: "Shelves/"+id,
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
