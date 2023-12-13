import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarehouseOperationListFilterModel } from 'src/app/models/model/filter/warehouseOperationListFilterModel';
import { WarehouseTransferListFilterModel } from 'src/app/models/model/filter/warehouseTransferListFilterModel';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { WarehosueTransferListModel } from 'src/app/models/model/warehouse/warehosueTransferListModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-warehouse-transfer-list',
  templateUrl: './warehouse-transfer-list.component.html',
  styleUrls: ['./warehouse-transfer-list.component.css']
})
export class WarehouseTransferListComponent implements OnInit {
  currentPage:number = 1;
  warehouseTransferListModels : WarehosueTransferListModel[]
  filterForm :FormGroup
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private warehosueService : WarehouseService,
    private formBuilder : FormBuilder,private generalService:GeneralService
  ) { }

  async ngOnInit() {
    this.spinnerService.show();
    this.  formGenerator();
    await this.getWarehouseOperations();

    
    this.spinnerService.hide();

  }

  formGenerator() {
    this.filterForm = this.formBuilder.group({
      orderNumber: [null],
      warehouseCode: [null],
      toWarehouseCode: [null],
      operationStartDate: [null],
      operationEndDate: [null],
    });
  }

  async routeNewPage(orderNumber:string|null){
    if(orderNumber!=null){
      this.router.navigate(["/warehouse-operation/"+orderNumber.split('TP-')[1] ])

    }else{
      const result = await this.generalService.generateGUID()
      this.router.navigate(["/warehouse-operation/"+result ])
    }
  }
  
  async onSubmit(model:WarehouseTransferListFilterModel){
    this.spinnerService.show()
    this.warehouseTransferListModels = await this.warehosueService.getWarehosueTransferListByFilter(model);
    this.spinnerService.hide();

  }
  async deleteTransfer(orderNumber: string) {
    // Silme işleminden önce kullanıcıya emin olup olmadığını sormak için bir onay penceresi göster
    const confirmDelete = window.confirm("Bu transferi silmek istediğinizden emin misiniz?");
    
    if (confirmDelete) {
      // Kullanıcı onayladıysa silme işlemini gerçekleştir
      const response = await this.warehosueService.deleteTransferFromId(orderNumber);
      if (response === true) {
        location.reload();
        this.alertifyService.success("İşlem Başarılı")
      }else{
        this.alertifyService.error("İşlem Başarısız")

      }
    }
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
      var  filterModel : WarehouseTransferListFilterModel = new WarehouseTransferListFilterModel()
      this. warehouseTransferListModels = await this.warehosueService.getWarehosueTransferListByFilter(filterModel);
        
    } catch (error: any) {
      console.log(error.message);
    }
  }

}