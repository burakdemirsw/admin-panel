import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaleOrderModel } from 'src/app/models/model/saleOrderModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-order-managament',
  templateUrl: './order-managament.component.html',
  styleUrls: ['./order-managament.component.css']
})
export class OrderManagamentComponent implements OnInit {


  saleOrderModels : SaleOrderModel[]
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.getOrders();
    this.spinnerService.hide();

  }
  getOrders(): any {
    try {
      this.httpClientService
        .get<SaleOrderModel>({
          controller: 'Order',
        })
        .subscribe((data) => {
          //console.log(data);
          this.saleOrderModels = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

}
