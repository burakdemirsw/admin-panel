import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateBarcodeFromOrder_RM } from 'src/app/components/Product/create-barcode/models/createBarcode';
import { WarehouseOperationListFilterModel } from 'src/app/models/model/filter/warehouseOperationListFilterModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

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
    private productService: ProductService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private warehosueService: WarehouseService,
    private formBuilder: FormBuilder,
    private orderService: OrderService, private headerService: HeaderService, private toasterService: ToasterService
  ) { }

  async ngOnInit() {
    this.spinnerService.show();
    this.formGenerator();
    await this.getWarehouseOperations('0');
    this.spinnerService.hide();
    this.headerService.updatePageTitle("Havuzda Kalan Transferler")
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
  visible: boolean = false;
  selectedOrderNo: string;
  showModal(operationNo: string) {
    this.selectedOrderNo = operationNo;
    this.visible = !this.visible;
  }
  async sendBarcodesToNebim(isPackage: boolean) {
    var request = new CreateBarcodeFromOrder_RM(isPackage)
    request.operationNo = this.selectedOrderNo;
    request.from = "order-operation";
    request.products = null;
    var response = await this.productService.sendBarcodesToNebim(request);
    if (response) {
      this.toasterService.success("İşlem Başarılı")
    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }


}
