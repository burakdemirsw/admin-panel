import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarehouseOperationListFilterModel } from 'src/app/models/model/filter/warehouseOperationListFilterModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-warehouse-operation-list',
  templateUrl: './warehouse-operation-list.component.html',
  styleUrls: ['./warehouse-operation-list.component.css']
})
export class WarehouseOperationListComponent implements OnInit {
  currentPage: number = 1;
  warehouseOperationListModels: WarehouseOperationListModel[]
  filterForm: FormGroup
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private warehosueService: WarehouseService,
    private formBuilder: FormBuilder,
    private orderService: OrderService
  ) { }

  async ngOnInit() {
    this.spinnerService.show();
    this.formGenerator();
    await this.getWarehouseOperations('0');
    this.spinnerService.hide();

  }
  //--------------------------------------------------------------------------------------------- ITEMS TO BRING
  itemsToCollectDialog: boolean = false;
  itemsToCollect: ProductOfOrder[] = [];
  async bringItemsToCollect(orderNumber: string) {
    this.itemsToCollect = [];
    this.itemsToCollectDialog = true;
    if (orderNumber.startsWith("W-")) {
      var orderNumberType = "WT";
    } else {
      var orderNumberType = orderNumber.split('-')[1];
    }


    if (orderNumberType === 'WT' || orderNumber.startsWith("W-")) {
      if (orderNumber.startsWith("W-")) {

        await this.getAllProducts(orderNumber.split('W-')[1], 'WT'); //toplanan ve toplanacak ürünleri çeker
      } else {
        await this.getAllProducts(orderNumber, 'WT'); //toplanan ve toplanacak ürünleri çeker
      }
    }
  }


  async getAllProducts(orderNo: string, orderNoType: string): Promise<any> {
    if (orderNo.startsWith("W-")) {
      orderNo = orderNo.split("W-")[1]
    }

    const productData = await this.orderService //toplanacak ürünler çekildi
      .getCollectedProducts(orderNo, orderNoType).toPromise();
    if (productData.length > 0) {
      this.itemsToCollect = productData;
    } else {
      this.itemsToCollectDialog = false;
    }


  }
  //---------------------------------------------------------------------------------------------
  formGenerator() {
    this.filterForm = this.formBuilder.group({
      innerNumber: [null],
      startDate: [null],
      endDate: [null],
    });
  }
  async onSubmit(model: WarehouseOperationListFilterModel) {
    this.warehouseOperationListModels = await this.warehosueService.getWarehosueOperationListByFilter(model);

  }

  setCurrentWarehouseToLocalStorage(warehouse: string, innerNumber: string) {
    localStorage.setItem('currentWarehouse', warehouse);
    //this.router.navigate(["/warehouse-operation-confirm-detail/"+innerNumber]);
  }
  innerNumberList: string[] = [];
  addInnerNumberToList(innerNumber: string) {
    if (!this.innerNumberList.includes(innerNumber)) {
      this.innerNumberList.push(innerNumber);
    } else {
      const index = this.innerNumberList.indexOf(innerNumber);
      this.innerNumberList.splice(index, 1);
    }
  }
  confirmOperation() {
    try {
      this.httpClientService
        .post<string[]>({
          controller: 'Warehouse/ConfirmOperation',
        }, this.innerNumberList)
        .subscribe((data) => {
          console.log(data);
          this.router.navigate(['/warehouse-operation-confirm']);
        });
    } catch (error: any) {
      console.log(error.message);
    }

  }


  selectedButton: number = 0

  async getWarehouseOperations(status: string): Promise<any> {
    try {
      this.selectedButton = Number(status)
      this.warehouseOperationListModels = await this.warehosueService.getWarehouseOperations(status);

    } catch (error: any) {
      console.log(error.message);
    }
  }

}
