import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarehouseOperationListFilterModel } from 'src/app/models/model/filter/warehouseOperationListFilterModel';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-warehouse-operation-list',
  templateUrl: './warehouse-operation-list.component.html',
  styleUrls: ['./warehouse-operation-list.component.css']
})
export class WarehouseOperationListComponent implements OnInit {
  currentPage:number = 1;
  warehouseOperationListModels : WarehouseOperationListModel[]
  filterForm :FormGroup
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private warehosueService : WarehouseService,
    private formBuilder : FormBuilder
  ) { }

  async ngOnInit() {
    this.spinnerService.show();
    await this.getWarehouseOperations();

    
    this.spinnerService.hide();

  }

  formGenerator() {
    this.filterForm = this.formBuilder.group({
      innerNumber: [null],
      startDate: [null],
      endDate: [null],
    });
  }
  async onSubmit(model:WarehouseOperationListFilterModel){
    this.warehouseOperationListModels = await this.warehosueService.getWarehosueOperationListByFilter(model);

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
          this.router.navigate(['/warehouse-operation-confirm']);
        });
    } catch (error: any) {
      console.log(error.message);
    }

  }
 async  getWarehouseOperations(): Promise<any> {
    try {
      this. warehouseOperationListModels = await this.warehosueService.getWarehouseOperations();
        
    } catch (error: any) {
      console.log(error.message);
    }
  }

}
