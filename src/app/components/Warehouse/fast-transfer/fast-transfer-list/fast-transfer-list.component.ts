import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api/public_api';
import { CreateBarcodeFromOrder_RM } from 'src/app/components/Product/create-barcode/models/createBarcode';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { UserShelf } from 'src/app/models/model/user/personalShelf';
import { UserClientInfoResponse } from 'src/app/models/model/user/userRegister_VM';
import { FastTransferListModel } from 'src/app/models/model/warehouse/fastTransferModel';
import { ExportCsvService } from 'src/app/services/admin/export-csv.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { UserService } from 'src/app/services/admin/user.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-fast-transfer-list',
  templateUrl: './fast-transfer-list.component.html',
  styleUrls: ['./fast-transfer-list.component.css']
})
export class FastTransferListComponent implements OnInit {
  shelf: any;
  currentPage: number = 1;
  constructor(

    private spinnerService: NgxSpinnerService,
    private router: Router, private headerService: HeaderService,
    private warehosueService: WarehouseService, private generalService: GeneralService,
    private productService: ProductService, private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private exportCsvService: ExportCsvService

  ) { }
  filterForm: FormGroup;
  fastTransferListModels: FastTransferListModel[] = []
  selectedTransfers: FastTransferListModel[] = []
  pageType: string;
  user_info: UserClientInfoResponse;
  async ngOnInit() {
    this.user_info = await this.userService.getUserClientInfoResponse();
    await this.getUserShelves();
    this.spinnerService.show();
    this.activatedRoute.params.subscribe(async (params) => {
      if (params["type"]) {
        this.pageType = params["type"];
        if (params["type"] == 'true') {
          this.headerService.updatePageTitle("Hızlı Transfer İstekleri")

        } else {
          this.headerService.updatePageTitle("Hızlı Transferler")

        }

        await this.getFastTransferList(params["type"]);

      }
    })

    this.spinnerService.hide();
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
    this.exportCsvService.exportToCsv(this.fastTransferListModels, 'my-orders');
  }
  userShelves: UserShelf[] = [];
  async getUserShelves() {
    var response = await this.userService.getUserShelves(this.user_info.userId)
    this.userShelves = response;
  }
  async goPage(pageType: string) {
    if (pageType != '4') {
      var uuid = await this.generalService.generateGUID()
      location.href =
        location.origin +
        '/shelf-transfer-request/' +
        uuid +
        '/' +
        pageType;
    } else {
      var uuid = await this.generalService.generateGUID()
      var shelfNo: string = this.shelf.shelfNo;
      var url = location.origin +
        '/shelf-transfer-request/' +
        uuid +
        '/' +
        pageType
        + '/' +
        shelfNo;
      this.toasterService.info(shelfNo)
      console.log(url)

      location.href =
        url;
    }

  }

  productsToCollect: ProductOfOrder[];

  // formGenerator() {
  //   this.filterForm = this.formBuilder.group({
  //     messageHeader: [null],
  //     level: [null],

  //     createdDate: [null],
  //     endDate: [null],
  //   });
  // }
  // async onSubmit(model: LogFilterModel) {
  //   var filter: LogFilterModel = new LogFilterModel();
  //   filter = model;
  //   this.log_VMList = await this.logService.getLogs(filter)
  // }

  async routeNewPage5(id?: string) {

    if (!id || id == '') {
      const result = await this.generalService.generateGUID()
      this.router.navigate(["/shelf-transfer-request/" + result +
        "/0"
      ])
    } else {

      this.router.navigate(["/shelf-transfer-request/" + id +
        "/0"
      ])
    }

  }

  async routeNewPage6(id?: string) {

    if (!id || id == '') {
      const result = await this.generalService.generateGUID()
      this.router.navigate(["/fast-transfer/" + result

      ])
    } else {


      this.router.navigate(["/fast-transfer/" + id

      ])
    }

  }
  async routeToCPP(operation: FastTransferListModel) {
    if (operation.operationId.includes("REQ-")) {
      operation.operationId = operation.operationId.split("REQ-")[1];
      // this.routeNewPage5(id.split("REQ-")[1])
    } if (operation.processType == 0) {
      this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);

    } else if (operation.processType == 1) {
      this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);

    } else if (operation.processType == 2) {
      this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);

    } else if (operation.processType == 3) {
      this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);

    } else if (operation.processType == 4) {
      this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType, operation.lastTargetShelfNo]);

    } else {
      this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);
    }
  }
  //toplanan ürünler sayfasına akatarır fakat önce ilgili siparişin içeriğinden paketNo'değerini çeker.

  async getFastTransferList(type: string): Promise<any> {
    var response = await this.warehosueService.getFastTransferListModels(type == 'true' ? true : false);
    this.fastTransferListModels = response;


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
    request.from = "fast-transfer";
    request.products = null;

    var response = await this.productService.sendBarcodesToNebim(request);
    if (response) {
      this.toasterService.success("İşlem Başarılı");
    } else {
      this.toasterService.error("İşlem Başarısız");
    }
  }


}
