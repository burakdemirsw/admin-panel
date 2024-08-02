import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { CreateBarcodeFromOrder_RM } from 'src/app/components/Product/create-barcode/models/createBarcode';
import { WarehouseOperationListFilterModel } from 'src/app/models/model/filter/warehouseOperationListFilterModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { TransferQr_Report } from 'src/app/models/model/warehouse/completeCount_CM';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { ExportCsvService } from 'src/app/services/admin/export-csv.service';
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
  warehouseOperationListModels: WarehouseOperationListModel[] = []
  selectedOperations: WarehouseOperationListModel[] = []
  filterForm: FormGroup
  constructor(
    private httpClientService: HttpClientService,
    private productService: ProductService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private warehosueService: WarehouseService,
    private formBuilder: FormBuilder,
    private orderService: OrderService, private headerService: HeaderService, private toasterService: ToasterService,
    private exportCsvService: ExportCsvService
  ) { }

  async ngOnInit() {
    this.spinnerService.show();
    this.formGenerator();
    await this.getWarehouseOperations('0');
    this.spinnerService.hide();
    this.headerService.updatePageTitle("Havuzda Kalan Transfer Paneli")
  }

  items: MenuItem[] = [
    {
      label: 'Excele Aktar',
      command: () => {
        this.exportCsv();
      }
    }
  ];
  exportCsv() {
    this.exportCsvService.exportToCsv(this.warehouseOperationListModels, 'my-orders');
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
  async createTransferReport(request: WarehouseOperationListModel) {
    var _request: TransferQr_Report = new TransferQr_Report();
    _request.count = request.count;
    _request.count2 = request.count_2;
    _request.innerNumber = request.innerNumber;
    _request.operationDate = request.operationDate;
    _request.source = request.source;
    _request.url = 'https://www.davyebkm.com/order-operation/' + request.innerNumber + '/false/' + request.toWarehouseCode
    _request.warehouseCode = request.warehouseCode;

    if (window.confirm("Barkodları yazdırmak istediğinize emin misiniz?")) {
      var data = await this.warehosueService.createTransferReport(_request);
      if (data) {


        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        // Create a temporary link element
        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.download = "marketplace-order-cargo-barcode.pdf";  // Set the filename for the download
        document.body.appendChild(downloadLink); // Append to body
        downloadLink.click();  // Trigger the download
        document.body.removeChild(downloadLink); // Remove the link after triggering the download
        URL.revokeObjectURL(fileURL); // Clean up the URL object



        const _file = new Blob([data], { type: 'application/pdf' });
        const _fileURL = URL.createObjectURL(_file);

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';  // Hide the iframe
        iframe.src = _fileURL;

        // Append the iframe to the body
        document.body.appendChild(iframe);

        // Wait until the iframe is loaded, then call print
        iframe.onload = () => {
          iframe.contentWindow?.print();
        };
        this.toasterService.success("BARKOD YAZDIRILDI");

      } else {
        this.toasterService.error("BARKOD YAZDIRILAMADI");
      }





    }
  }

}
