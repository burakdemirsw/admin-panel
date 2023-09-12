import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { ShelfModel } from 'src/app/models/model/shelf/ShelfModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-warehosue-shelf-count',
  templateUrl: './warehosue-shelf-count.component.html',
  styleUrls: ['./warehosue-shelf-count.component.css']
})
export class WarehosueShelfCountComponent implements OnInit {
  [x: string]: any;

  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[]=[];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private httpClient : HttpClient,
    private router : Router,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {

    this.formGenerator();
    // this.getOrdersProduct("1-WS-2-11626")
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

  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode:  ['',Validators.required],
      shelfNo: [ '',Validators.required],
    });
  }

  list : CountProductRequestModel[]  = []
  
  async onSubmit(countProductRequestModel: CountProductRequestModel):Promise<any> {
    const url = ClientUrls.baseUrl+'/Order/CountProduct';
    countProductRequestModel.shelfNo=  countProductRequestModel.shelfNo ==undefined ||  countProductRequestModel.shelfNo =='' ||  countProductRequestModel.shelfNo == null ? "" : countProductRequestModel.shelfNo
    try {
      var response = await this.httpClient.post<ProductCountModel | undefined>(url, countProductRequestModel).toPromise();

      if (response === undefined) {
        // Handle the undefined case, perhaps throw an error or set a default value.
      } else {
        var data: ProductCountModel = response;

        if(data.status=="Barcode"){
            countProductRequestModel.barcode=response.description;
          this.list.push(countProductRequestModel)
          this.checkForm.get("barcode")?.setValue(""); 
          this.focusNextInput("barcode");
        }else{
          this.checkForm.get("barcode")?.setValue(""); 

          this.checkForm.get("shelfNo")?.setValue(data.description); 
        }
      }

    } catch (error: any) {
      console.log(error.message);
    }
  }

async check(){
await this.onSubmit(this.checkForm.value)
}

  enableBarcodeInput() {
    this.checkForm.get('barcode')?.enable();
  }

}


