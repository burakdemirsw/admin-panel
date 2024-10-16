import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { ZTMSG_CreateCargoBarcode_CM } from 'src/app/models/model/cargo/ZTMSG_CreateCargoBarcode_CM';
import { OrderFilterModel } from 'src/app/models/model/filter/orderFilterModel';
import { PrinterInvoiceRequestModel } from 'src/app/models/model/order/printerInvoiceRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { CargoService } from 'src/app/services/admin/cargo.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { ExportCsvService } from 'src/app/services/export-csv.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CreateBarcodeFromOrder_RM } from '../../Product/create-barcode/models/createBarcode';
import { MarketplaceService } from 'src/app/services/admin/marketplace.service';
import { UserService } from '../../../services/admin/user.service';
import { UserClientInfoResponse } from 'src/app/models/model/user/userRegister_VM';
import { RaportService } from 'src/app/services/admin/raport.service';

@Component({
  selector: 'app-order-managament',
  templateUrl: './order-managament.component.html',
  styleUrls: ['./order-managament.component.css']
})
export class OrderManagamentComponent implements OnInit {
  cargoFirms = ClientUrls.cargoFirms;
  numberOfList: number[] = [1, 10, 20, 50, 100]
  saleOrderModels: SaleOrderModel[]
  selectedOrders: SaleOrderModel[] = [];
  currentPage: number = 1;
  constructor(
    private headerService: HeaderService,
    private httpClientService: HttpClientService,
    private toasterService: ToasterService,
    private userService: UserService,
    private router: Router,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private exportCsvService: ExportCsvService,
    private cargoService: CargoService,
    private marketplaceService: MarketplaceService,
    private raportService: RaportService

  ) { }
  user: UserClientInfoResponse;
  filterForm: FormGroup;
  pageDescription: boolean = false;
  _pageDescription: boolean = false;
  pageDescriptionLine: string = "Alınan Siparişler"
  columns = [
    "Sipariş Tarihi",
    "Sipariş Numarası",
    "Müşteri Kodu",
    "Müşteri Adı",
    "Satıcı Kodu",
    "Açıklama",
    "Miktar",
    "Tutar",
    "Toplanan Miktar",
    "Toplanalabilir Miktar",
    "Depo",
    "Kargo",
    "Fatura",
    "İşlemler"
  ];
  status = 1;
  invoiceStatus = 2
  cargoSelectVisible: boolean = false;
  items: MenuItem[] = [
    {
      label: 'Kargola',
      command: () => {
        this.cargoSelectVisible = true;
      }
    },
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv();
      }
    },
    {
      label: 'İrsaliye Çıktısı Al',
      command: () => {
        this.getWayBillReport();
      }
    },
    // {
    //   label: 'Sipariş Durumunu Güncelle',
    //   command: () => {
    //     this.updateOrderStatus();
    //   }
    // },

    {
      label: 'Siparişleri Sil',
      command: () => {
        this.deleteNebimOrder();
      }
    }
    ,

    {
      label: 'Faturalaştırılan Siparişler',
      command: () => {
        this.getOrders(1, 1);
      }
    }
    ,

    {
      label: 'Faturalaştırılmayan Siparişler',
      command: () => {
        this.getOrders(1, 2);
      }
    }
  ];
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
    this.user = this.userService.getUserClientInfoResponse();
    // console.log(this.user);
    //this.saleOrderModels = this.saleOrderModels.filter(o => o.warehouseCode == this.user.warehouseCode);
    this.setPageDescription();

  }
  productsToCollect: ProductOfOrder[];
  exportCsv() {
    this.exportCsvService.exportToCsv(this.selectedOrders, 'my-data');
  }
  async deleteNebimOrder() {
    if (this.selectedOrders.length < 1) {
      this.toasterService.warn('Lütfen En Az Bir Sipariş Seçiniz.')
    }

    if (window.confirm(this.selectedOrders.length + " Adet Siparişi silmek istediğinize emin misiniz?")) {

      this.selectedOrders.forEach(async order => {
        var response = await this.orderService.deleteNebimOrder(order.orderNumber)
        if (response) {
          this.toasterService.success("İşlem Başarılı")
          this.getOrders(this.status, this.invoiceStatus)
        }
      });
    }


  }

  async getWayBillReport() {
    var orderNumberList = this.selectedOrders.map(x => x.orderNumber) as string[];
    var response = await this.raportService.getWayBillReport(orderNumberList)
    if (response) {
      this.toasterService.success("İşlem Başarılı")
    } else {
      this.toasterService.error("İşlem Başarısız")
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

  url = 'drive.google.com/uc?export=view&id=1Dl1SKEWpKPaNDSmtjJq15oGx1PzoLyJE';
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
    var response = await this.raportService.sendInvoiceToPrinter(orderNumber);
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
      location.href = location.origin + "/order-operation/" + this.searchedOrder + "/false/MD";
    }

  }


  async selectCargo(cargo: any) {
    this.createCargoBulk(this.selectedOrders, cargo.id)


    await this.updateOrderStatus();
    this.cargoSelectVisible = false;

  }

  async updateOrderStatus() {
    if (window.confirm("Sipariş Durumları Değiştirilsin Mi? (KARGOYA VERİLDİ)")) {
      await this.marketplaceService.updateIdeasoftOrderStatus(this.selectedOrders)
    }
  }


  getCargoImage(name: string): string {
    switch (name) {
      case 'MNG':
        return '../../../../assets/img/cargo/mnglogo.png';
      case 'Aras':
        return '../../../../assets/img/cargo/araslogo.png';
      case 'Yurtiçi':
        return '../../../../assets/img/cargo/yurticilogo.png';
      case 'Arşın':
        return '../../../../assets/img/cargo/arsinlogo2.png';
      case 'Kargola':
        return '../../../../assets/img/cargo/kargolalogo.png';
      default:
        return '';
    }
  }
  async createCargoBulk(request: SaleOrderModel[], cargoFirmId: number) {

    if (cargoFirmId == 2) {
      this.toasterService.warn('Bu kargo firması ile işlem yapamazsınız.')
      return;
    }
    if (this.selectedOrders.length > 0) {
      if (window.confirm("Seçili Siparişleri Kargoya Göndermek İstediğinize Emin Misiniz?")) {

        var request = this.selectedOrders.filter(x => x.isShipped == false);
        var _request: ZTMSG_CreateCargoBarcode_CM[] = [];
        for (let i = 0; i < request.length; i++) {
          var __request = new ZTMSG_CreateCargoBarcode_CM();
          __request.orderNumber = request[i].orderNumber;
          __request.cargoFirmId = cargoFirmId;
          _request.push(__request);
        }
        var response = await this.cargoService.createCargoBulk(_request);
        if (response) {
          this.getOrders(this.status, this.invoiceStatus)
          this.toasterService.success("İşlem Başarılı")
        } else {
          this.toasterService.error("İşlem Başarısız")
        }

      }
    } else {
      this.toasterService.warn('Lütfen En Az Bir Sipariş Seçiniz.')
    }


  }

}




