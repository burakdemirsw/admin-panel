import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CreateBarcodeFromOrder_RM } from 'src/app/components/Product/create-barcode/models/createBarcode';
import { CountListFilterModel } from 'src/app/models/model/filter/countListFilterModel';
import { InnerLine_VM } from 'src/app/models/model/warehouse/ztmsg_CountedProduct';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-add-product-to-shelf-list',
  templateUrl: './add-product-to-shelf-list.component.html',
  styleUrl: './add-product-to-shelf-list.component.css'
})
export class AddProductToShelfListComponent {
  currentPage: number = 1; // Başlangıçta ilk sayfayı göster
  filterForm: FormGroup;
  constructor(

    private toasterService: ToasterService,
    private productService: ProductService,
    private router: Router,
    private formBuilder: FormBuilder,

    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private title: Title,
    private headerService: HeaderService
  ) { }

  async ngOnInit() {

    //this.spinnerService.show();
    this.headerService.updatePageTitle("Rafa Ürün Ekle/Çıkar Listesi")
    this.formGenerator();
    await this.getGetCountList();

    //this.spinnerService.hide();

  }
  items: MenuItem[] = [
    {
      label: 'Rafa Ürün Ekle',
      command: () => {
        this.route(true)
      }
    },
    {
      label: 'Raftan Ürün Çıkar',
      command: () => {
        this.route(false)
      }
    }
  ];
  async route(isInQty: boolean) {
    const result = await this.generalService.generateGUID()

    if (isInQty) {
      this.router.navigate(["/add-product-to-shelf/CI/false/"])
    } else {
      this.router.navigate(["/add-product-to-shelf/CO/false/"])
    }

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
  async newCount() {
    try {
      const orderNo: string = await this.generalService.generateGUID();
      this.router.navigate(['/warehouse-shelf-count/count/' + orderNo]);
    } catch (error: any) {
      console.log(error.message);
    }

  }
  async newCount2() {
    try {
      const orderNo: string = await this.generalService.generateGUID();
      this.router.navigate(['/warehouse-shelf-count/CI']);
    } catch (error: any) {
      console.log(error.message);
    }

  }
  async newCount3() {
    try {
      const orderNo: string = await this.generalService.generateGUID();
      this.router.navigate(['/warehouse-shelf-count/CO']);
    } catch (error: any) {
      console.log(error.message);
    }

  }

  countList: InnerLine_VM[]

  async getGetCountList(): Promise<any> {
    try {
      var request: string[] = ["CI", "CO"];
      this.countList = await this.warehouseService.getInnerHeaders(request);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  formGenerator() {
    this.filterForm = this.formBuilder.group({
      orderNo: [null, Validators.required],
      totalProduct: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]

    });
  }

  async deleteCountFromId(orderNumber: string) {
    // Silme işleminden önce kullanıcıya emin olup olmadığını sormak için bir onay penceresi göster
    const confirmDelete = window.confirm("Bu transferi silmek istediğinizden emin misiniz?");

    if (confirmDelete) {
      // Kullanıcı onayladıysa silme işlemini gerçekleştir
      const response = await this.warehouseService.deleteCountFromId(orderNumber);
      if (response === true) {
        location.reload();
        this.toasterService.success("İşlem Başarılı")
      } else {
        this.toasterService.error("İşlem Başarısız")

      }
    }
  }


  async onSubmit(model: CountListFilterModel) {
    //this.spinnerService.show()
    const response = await this.warehouseService.GetCountListByFilter(model)
    if (response) {
      this.countList = response;
      //this.spinnerService.hide()
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
    request.from = "warehouse-shelf-count";
    request.products = null;
    var response = await this.productService.sendBarcodesToNebim(request);
    if (response) {
      this.toasterService.success("İşlem Başarılı")
    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }
}
