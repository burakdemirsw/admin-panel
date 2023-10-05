import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReadyToShipmentPackageModel } from 'src/app/models/model/order/readyToShipmentPackageModel';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-collected-packages',
  templateUrl: './collected-packages.component.html',
  styleUrls: ['./collected-packages.component.css']
})
export class CollectedPackagesComponent implements OnInit {
  currentPage : number = 1;
  numberOfList : number[] = [1,10,20,50,100]
  readyToShipmentPackageModels : ReadyToShipmentPackageModel[]
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router : Router

  ) { }

  ngOnInit(): void {

    this.spinnerService.show();
    this.getOrders();
    this.spinnerService.hide();

  }

  routeToCPP(){
    var number = (document.getElementById("numberOfList") as HTMLInputElement).value
    if(number==null || number == ''){
      alert("Lütfen Bir Müktar Seçiniz")
    }
    
    this.router.navigate(['/collect-product-of-order'+number.toString()]);
  }
  getOrders(): any {
    try {
      this.httpClientService
        .get<ReadyToShipmentPackageModel>({
          controller: 'order/GetReadyToShipmentPackages',
        })
        .subscribe((data) => {
          //console.log(data);
          this.readyToShipmentPackageModels = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

}
