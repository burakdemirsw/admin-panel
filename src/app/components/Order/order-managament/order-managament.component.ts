import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { OrderFilterModel } from 'src/app/models/model/filter/orderFilterModel';
import { PrinterInvoiceRequestModel } from 'src/app/models/model/order/printerInvoiceRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { ExportCsvService } from 'src/app/services/admin/export-csv.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CreateBarcodeFromOrder_RM } from '../../Product/create-barcode/models/createBarcode';

@Component({
  selector: 'app-order-managament',
  templateUrl: './order-managament.component.html',
  styleUrls: ['./order-managament.component.css']
})
export class OrderManagamentComponent implements OnInit {

  numberOfList: number[] = [1, 10, 20, 50, 100]
  saleOrderModels: SaleOrderModel[]
  selectedOrders: SaleOrderModel[] = [];
  currentPage: number = 1;
  constructor(
    private headerService: HeaderService,
    private httpClientService: HttpClientService,
    private toasterService: ToasterService,
    private exportCsvService: ExportCsvService,
    private router: Router,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService

  ) { }
  filterForm: FormGroup;
  pageDescription: boolean = false;
  _pageDescription: boolean = false;
  pageDescriptionLine: string = "Alınan Siparişler"

  items: MenuItem[] = [
    {
      label: 'Excele Aktar',
      command: () => {
        this.exportCsv();
      }
    },
    {
      label: 'Excele Ürünleri Aktar Aktar',
      command: () => {
        this.exportCsv_Products();
      }
    },
    {
      label: 'Toplanabilir Siparişler',
      command: () => {
        this.getOrders(1, 2);
      }
    },
    {
      label: 'Toplanamaz Siparişler',
      command: () => {
        this.getOrders(0, 2);
      }
    },
    {
      label: 'Eksik Ürünlü Siparişler',
      command: () => {
        this.getMissingOrders();
      }
    },
    {
      label: 'Faturalandırılan Siparişler',
      command: () => {
        this.getOrders(1, 1);
      }
    },
    {
      label: 'Faturalandırılmayan Siparişler',
      command: () => {
        this.getOrders(1, 2);
      }
    },
    {
      label: 'Kısmi Faturalandırılan Siparişler',
      command: () => {
        this.getOrders(0, 3);
      }
    }
  ];
  exportCsv() {
    this.exportCsvService.exportToCsv(this.saleOrderModels, 'my-orders');
  }
  async exportCsv_Products() {
    var data: any[] = [];

    // Create an array of promises
    var promises = this.selectedOrders.map(async order => {
      var response = await this.orderService.getOrderDetail(order.orderNumber);

      return response.products;
    });

    // Wait for all promises to resolve
    var productsArray = await Promise.all(promises);

    // Flatten the array if necessary
    data = productsArray.flat();

    // Export the data to CSV
    this.exportCsvService.exportToCsv(data, 'my-products');
  }

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

  async deleteNebimOrder(request: string) {
    var response = await this.orderService.deleteNebimOrder(request)
    if (response) {
      this.toasterService.success("İşlem Başarılı")
      this.getOrders(this.status, this.invoiceStatus)
    }
  }

  async deleteNebimInvoiceAndOrder(request: string) {
    var response = await this.orderService.deleteNebimInvoiceAndOrder(request)
    if (response) {
      this.toasterService.success("İşlem Başarılı")
      this.getOrders(this.status, this.invoiceStatus)
    }
  }
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
    this.saleOrderModels = await this.orderService.getOrdersByFilter(model)

  }



  //toplanan ürünler sayfasına akatarır fakat önce ilgili siparişin içeriğinden paketNo'değerini çeker.
  async routeToCPP() {
    let listNumber: string = (document.getElementById('numberOfList') as HTMLInputElement).value;

    if (listNumber == null || listNumber == '') {
      this.toasterService.warn('Lütfen Bir Müktar Seçiniz');
    } else {
      try {
        // Wait for the products to be fetched before navigating
        //this.spinnerService.show()

        setTimeout(async () => { // async işlev içinde setTimeout kullanıldı
          const listNumber = 123; // Örnek bir liste numarası
          const data = await this.httpClientService.get<ProductOfOrder>({
            controller: 'Order/GetProductsOfOrders/' + listNumber.toString(),
          }).toPromise();

          this.productsToCollect = data;

          // Veriler çekildikten sonra productsToCollect dizisine erişebilirsiniz
          if (this.productsToCollect.length > 0) {
            this.router.navigate(['/collect-product-of-order/' + this.productsToCollect[0].packageNo]);
          } else {
            // Hiç ürün bulunamadığında nasıl bir işlem yapılacağını ele alın
            this.toasterService.warn('İşlem Yapıclacak Veri Gelmedi.');
          }

          //this.spinnerService.hide();
        }, 1000); // 1000 milisaniye (1 saniye) bekle



      } catch (error: any) {
        console.log('Error fetching products:', error.message);
      }
    }
  }
  async getMissingOrders() {
    this.status = -1
    this.invoiceStatus = -1;
    const response =
      this.saleOrderModels = await this.orderService.getMissingOrders()


    this.filterOrdersByRole();
    this.setPageDescription();

  }

  // 1, 2 toplanabilir
  // 1, 1 faturalandırılan
  async getOrders(status: number, invoiceStatus: number): Promise<any> {

    this.status = status;
    this.invoiceStatus = invoiceStatus;
    if (location.href.includes("missing-list")) {
      const response =
        this.saleOrderModels = await this.orderService.getMissingOrders()
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
  async deleteInvoiceProducts(orderNumber: string) {

    const confirmDelete = window.confirm("Bu transferi silmek istediğinizden emin misiniz?");
    if (confirmDelete) {
      // Kullanıcı onayladıysa silme işlemini gerçekleştir
      const response = await this.orderService.deleteInvoiceProducts(orderNumber);
      if (response === true) {
        location.reload();
        this.toasterService.success("İşlem Başarılı")
      } else {
        this.toasterService.error("İşlem Başarısız")

      }
    }


  }
  printPicture(url: string) {
    var model: PrinterInvoiceRequestModel = new PrinterInvoiceRequestModel();
    model.printerName = "EPSON-DEPO (L3150 Series)"
    model.url = url;
    try {
      this.httpClientService
        .post<PrinterInvoiceRequestModel>({
          controller: 'Order/TryPrintPicture',
        }, model)
        .subscribe((data) => {
          console.log(data);
          // this.saleOrderModels = data;
        });
    } catch (error: any) {
      console.log(error.message);
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

  async deleteOrder() {
    var response = await this.orderService.deleteNebimOrder(this.selectedOrderNo);
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

  async sendInvoiceToPrinter(orderNumber: string) {
    var response = await this.orderService.sendInvoiceToPrinter(orderNumber);
    if (response) {
      this.toasterService.success("İşlem Başarılı")
    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }

  async createPdf(orderNumber: string) {
    var response = await this.orderService.createPdf(orderNumber);
    if (response) {
      this.toasterService.success("İşlem Başarılı")
    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }

  searchedOrder: string = "";
  goToPage() {
    if (this.searchedOrder.includes("http")) {
      location.href = this.searchedOrder;
    } else {
      location.href = this.searchedOrder;
    }

  }

}




