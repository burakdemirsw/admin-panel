import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { WarehouseTransferListFilterModel } from 'src/app/models/model/filter/warehouseTransferListFilterModel';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { WarehosueTransferListModel } from 'src/app/models/model/warehouse/warehosueTransferListModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CreateBarcodeFromOrder_RM } from '../../Product/create-barcode/models/createBarcode';

@Component({
  selector: 'app-warehouse-transfer-list',
  templateUrl: './warehouse-transfer-list.component.html',
  styleUrls: ['./warehouse-transfer-list.component.css']
})
export class WarehouseTransferListComponent implements OnInit {
  currentPage: number = 1;
  warehouseTransferListModels: WarehosueTransferListModel[] = []
  selectedTransfers: WarehosueTransferListModel[] = []
  filterForm: FormGroup
  constructor(
    private hs: HeaderService,
    private httpClientService: HttpClientService,
    private toasterService: ToasterService,
    private productService: ProductService,
    private router: Router,
    private warehosueService: WarehouseService,
    private formBuilder: FormBuilder, private generalService: GeneralService
  ) { }

  async ngOnInit() {
    //this.spinnerService.show();
    this.formGenerator();
    await this.getWarehouseOperations();

    this.hs.updatePageTitle("Depolar Arası Transfer")
    //this.spinnerService.hide();

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

  async routeNewPage(orderNumber: string | null) {
    if (orderNumber != null) {
      this.router.navigate(["/warehouse-operation/" + orderNumber.split('TP-')[1] + "/" + "0"])

    } else {
      const result = await this.generalService.generateGUID()
      this.router.navigate(["/warehouse-operation/" + result + "/" + "0"])
    }
  }

  async onSubmit(model: WarehouseTransferListFilterModel) {
    //this.spinnerService.show()
    this.warehouseTransferListModels = await this.warehosueService.getWarehosueTransferListByFilter(model);
    //this.spinnerService.hide();

  }
  async deleteTransfer(orderNumber: string) {
    // Silme işleminden önce kullanıcıya emin olup olmadığını sormak için bir onay penceresi göster
    const confirmDelete = window.confirm("Bu transferi silmek istediğinizden emin misiniz?");

    if (confirmDelete) {
      // Kullanıcı onayladıysa silme işlemini gerçekleştir
      const response = await this.warehosueService.deleteTransferFromId(orderNumber);
      if (response === true) {
        location.reload();
        this.toasterService.success("İşlem Başarılı")
      } else {
        this.toasterService.error("İşlem Başarısız")

      }
    }
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
  async getWarehouseOperations(): Promise<any> {
    try {
      var filterModel: WarehouseTransferListFilterModel = new WarehouseTransferListFilterModel()
      this.warehouseTransferListModels = await this.warehosueService.getWarehosueTransferListByFilter(filterModel);

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
    request.from = "warehouse-transfer";
    request.products = null;
    var response = await this.productService.sendBarcodesToNebim(request);
    if (response) {
      this.toasterService.success("İşlem Başarılı")
    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }
  async routeNewPage2() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/warehouse-operation/" + "REQ-" + result + "/0"])
  }


}
