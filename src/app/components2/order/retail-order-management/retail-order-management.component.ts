import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateBarcodeFromOrder_RM } from 'src/app/components/Product/create-barcode/models/createBarcode';
import { OrderFilterModel } from 'src/app/models/model/filter/orderFilterModel';
import { PrinterInvoiceRequestModel } from 'src/app/models/model/order/printerInvoiceRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { RetailOrderService } from 'src/app/services/admin/retail/retail-order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-retail-order-management',
  templateUrl: './retail-order-management.component.html',
  styleUrls: ['./retail-order-management.component.css']
})
export class RetailOrderManagementComponent implements OnInit {

  numberOfList: number[] = [1, 10, 20, 50, 100,]
  saleOrderModels: SaleOrderModel[]
  currentPage: number = 1;
  constructor(
    private headerService: HeaderService,
    private httpClientService: HttpClientService,
    private toasterService: ToasterService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private orderService: RetailOrderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService

  ) { }
  filterForm: FormGroup;
  pageDescription: boolean = false;
  _pageDescription: boolean = false;
  pageDescriptionLine: string = "Alınan Siparişler"


  status = 1;
  invoiceStatus = 2
  async ngOnInit() {
    //this.spinnerService.show();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['status']) {
        this.status = params['status']
      }
      if (params['invoiceStatus']) {
        this.invoiceStatus = params['invoiceStatus']
      }


    });
    if (location.href.includes("missing-list")) {
      this.pageDescription = true
      this.pageDescriptionLine = "Eksik Siparişler"
    }

    this.formGenerator()
    await this.getOrders(this.status, this.invoiceStatus);
    //this.spinnerService.hide();
    this.setPageDescription();

  }
  productsToCollect: ProductOfOrder[];


  setPageDescription() {

    if (this.status == 1 && this.invoiceStatus == 2) {

      this.pageDescriptionLine = "Toplanabilir Faturalandırılmayan Siparişler"
    }
    if (this.status == 0 && this.invoiceStatus == 2) {

      this.pageDescriptionLine = "Toplanamaz Siparişler"
    } if (this.status == -1 && this.invoiceStatus == -1) {

      this.pageDescriptionLine = "Eksik Ürünlü Siparişler"
    } if (this.status == 1 && this.invoiceStatus == 1) {

      this.pageDescriptionLine = "Faturalandırılan Siparişler"
    } if (this.status == 1 && this.invoiceStatus == 2) {

      this.pageDescriptionLine = "Toplanabilir Siparişler"
    } if (this.status == 0 && this.invoiceStatus == 3) {

      this.pageDescriptionLine = "Kısmi Faturalaştırılan Siparişler"
    }
    this.headerService.updatePageTitle(this.pageDescriptionLine);

  }
  formGenerator() {
    this.filterForm = this.formBuilder.group({
      orderNo: [null],
      currAccCode: [null],
      customerName: [null],
      sellerCode: [null],
      startDate: [null],
      endDate: [null],
    });
  }
  async onSubmit(model: OrderFilterModel) {
    // this.saleOrderModels = await this.orderService.getOrdersByFilter(model)
    this.toasterService.warn('Bu özellik şu anda kullanılamıyor.')

  }



  //toplanan ürünler sayfasına akatarır fakat önce ilgili siparişin içeriğinden paketNo'değerini çeker.
  async routeToCPP(number: string) {

    if (number == null || number == '') {
      this.toasterService.warn('Lütfen Bir Müktar Seçiniz');
    } else {
      try {


        const data = await this.orderService.getProductOfOrder(number.toString());

        this.productsToCollect = data;


        if (this.productsToCollect.length > 0) {

          //5 adet ürünü toplamak için oluşturur
          this.router.navigate(['/collect-product-of-order/' + this.productsToCollect[0].packageNo]);
        } else {

          this.toasterService.warn('İşlem Yapıclacak Veri Gelmedi.');
        }


      } catch (error: any) {
        console.log('Error fetching products:', error.message);
      }
    }
  }
  async getMissingOrders() {
    // this.status = -1
    // this.invoiceStatus = -1;
    // const response =
    //   this.saleOrderModels = await this.orderService.getMissingOrders()


    // this.filterOrdersByRole();
    // this.setPageDescription();
    this.toasterService.warn('Bu özellik şu anda kullanılamıyor.')

  }
  async getOrders(status: number, invoiceStatus: number): Promise<any> {

    this.status = status;
    this.invoiceStatus = invoiceStatus;
    if (location.href.includes("missing-list")) {
      // const response =
      //   this.saleOrderModels = await this.orderService.getMissingOrders()
      this.toasterService.warn('Bu özellik şu anda kullanılamıyor.')
    } else {
      const response =
        this.saleOrderModels = await this.orderService.getOrders(status, invoiceStatus)

    }
    this.filterOrdersByRole();
    this.setPageDescription();

  }

  filterOrdersByRole() {
    if (localStorage.getItem('roleDescription') != 'Admin') {
      this.saleOrderModels = this.saleOrderModels.filter(x => x.salespersonCode == localStorage.getItem('salesPersonCode'))
      this.toasterService.info('Sadece Kendi Siparişlerinizi Görebilirsiniz.')
    }
  }



  async routeNewPage3(orderNumber: string) {
    this.router.navigate(["/order-operation/" + "MIS-" + orderNumber])
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

  visible2: boolean = false;
}
