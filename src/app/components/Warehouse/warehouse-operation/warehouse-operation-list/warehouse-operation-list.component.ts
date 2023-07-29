import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-warehouse-operation-list',
  templateUrl: './warehouse-operation-list.component.html',
  styleUrls: ['./warehouse-operation-list.component.css']
})
export class WarehouseOperationListComponent implements OnInit {
  warehouseOperationListModels : WarehouseOperationListModel[]
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.getWarehouseOperations();

    
    this.spinnerService.hide();

  }
  setCurrentWarehouseToLocalStorage(warehouse: string,innerNumber : string) {
    localStorage.setItem('currentWarehouse', warehouse);
    //this.router.navigate(["/warehouse-operation-confirm-detail/"+innerNumber]);
  }
  innerNumberList : string[] = [];
  addInnerNumberToList(innerNumber : string){
    if (!this.innerNumberList.includes(innerNumber)) {
      this.innerNumberList.push(innerNumber);
    } else {
      const index = this.innerNumberList.indexOf(innerNumber);
      this.innerNumberList.splice(index, 1);
    }
  }
  confirmOperation(){
    try {
      this.httpClientService
        .post<string[]>({
          controller: 'Warehouse/ConfirmOperation',
        },this.innerNumberList)
        .subscribe((data) => {
          console.log(data);
          location.href = "http://localhost:4200/warehouse-operation-confirm";
        });
    } catch (error: any) {
      console.log(error.message);
    }

  }
  getWarehouseOperations(): any {
    try {
      this.httpClientService
        .get<WarehouseOperationListModel>({
          controller: 'Warehouse/GetWarehosueOperationList',
        })
        .subscribe((data) => {
          //console.log(data);
          this.warehouseOperationListModels = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

}
