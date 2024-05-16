import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateBarcodeFromOrder_RM } from 'src/app/components/Product/create-barcode/models/createBarcode';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { FastTransferListModel } from 'src/app/models/model/warehouse/fastTransferModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-fast-transfer-list',
  templateUrl: './fast-transfer-list.component.html',
  styleUrls: ['./fast-transfer-list.component.css']
})
export class FastTransferListComponent implements OnInit {

  currentPage: number = 1;
  constructor(

    private spinnerService: NgxSpinnerService,
    private router: Router, private headerService: HeaderService,
    private warehosueService: WarehouseService, private generalService: GeneralService,
    private productService: ProductService, private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute

  ) { }
  filterForm: FormGroup;
  fastTransferListModels: FastTransferListModel[] = []
  pageType: string;
  async ngOnInit() {

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
  async goPage(pageType: string) {
    var uuid = await this.generalService.generateGUID()
    location.href =
      location.origin +
      '/shelf-transfer-request/' +
      uuid +
      '/' +
      pageType;
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
  async routeToCPP(id: string) {
    if (id.includes("REQ-")) {
      this.routeNewPage5(id.split("REQ-")[1])
    } else {
      this.routeNewPage6(id)
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
