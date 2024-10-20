import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';
import { InvoiceProcess } from "src/app/models/model/invoice/InvoiceProcess";
import { ExchangeRate } from 'src/app/models/model/order/exchangeRate';
import { CustomerAddress_VM, CustomerList_VM, GetCustomerList_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { Payment } from 'src/app/models/model/order/nebimOrder';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import { ZTMSG_Proposal, ZTMSG_ProposalProduct } from 'src/app/models/model/product/proposalProduct';
import { FastTransfer_VM } from 'src/app/models/model/warehouse/transferRequestListModel';
import { CustomerService } from 'src/app/services/admin/customer.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrl: './create-proposal.component.css'
})
export class CreateProposalComponent implements OnInit {



  [x: string]: any;

  selectedCustomers: CustomerList_VM[] = []
  selectedProducts: ProductList_VM[] = []
  selectedAddresses: CustomerAddress_VM[] = []
  selectedOfficeAndWarehosue: any[] = [];
  _selectableCustomers: any[] = [];
  currAccCode: string;
  salesPersonCode: string;
  payment: Payment = new Payment();
  activeIndex = 0;
  @ViewChild('findCustomer', { static: false }) findCustomer: ElementRef;
  @ViewChild('findAddress', { static: false }) findAddress: ElementRef;
  @ViewChild('findProducts', { static: false }) findProducts: ElementRef;
  @ViewChild('preview', { static: false }) preview: ElementRef;

  true: boolean = true;
  orderNo: string;
  id: string;
  orderType: boolean;
  pageTitle: string;
  exchangeRate: ExchangeRate;
  isCollapsed: boolean = false;
  isCollapsed_2: boolean = false;
  updateProductForm: FormGroup;
  discountForm: FormGroup;
  getProductsForm: FormGroup;
  constructor(private headerService: HeaderService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private customerService: CustomerService
  ) { }

  async ngOnInit() {
    this.createUpdateProductForm()
    this.orderType = true;
    this.pageTitle = "Teklif Oluştur"

    await this.getProposalProducts();

    this.activatedRoute.params.subscribe(async (params) => {
      if (params['id']) {
        this.proposalId = params['id']
        await this.addProposal();
        await this.getProposalProducts();
      } else {
        await this.addProposal();
      }
    })
    this.headerService.updatePageTitle(this.pageTitle);
    this.createDiscountForm();
  }
  createUpdateProductForm() {
    this.updateProductForm = this.formBuilder.group({
      price: [null, Validators.required],
      quantity: [null, Validators.required],
      discountRate1: [null, Validators.required],
      discountRate2: [null, Validators.required],
    });
  }
  createDiscountForm() {

    this.discountForm = this.formBuilder.group({
      cashDiscountRate: [null, Validators.required],
      percentDiscountRate: [null, Validators.required]
    });
  }


  //---------------------------------------------------- Dialog değişkenleri ve metodları


  @ViewChild('subCurrAccDescription_dropdown') dropdown_3: Dropdown;
  @ViewChild('currAccDescription_dropdown') dropdown: Dropdown;
  @ViewChild('phoneNumber_dropdown') dropdown_2: Dropdown;

  showPanel(type: Number) {

    if (this.selectedCustomers.length == 0) {
      if (type == 1) {
        if (this.dropdown) {
          this.dropdown.show();
        }
      }
      else if (type == 2) {
        if (this.dropdown_2) {
          this.dropdown_2.show();
        }
      }


    }
    else if (type == 3) {
      if (this.dropdown_3) {
        this.dropdown_3.show();
      }
    }

  }

  updateProductDialog: boolean = false;
  getCustomerDialog: boolean = false;
  findProductDialog: boolean = false;

  openDialog(dialogName: string) {
    if (dialogName === "getCustomerDialog") {
      this.getCustomerDialog = !this.getCustomerDialog
    }
    if (dialogName === "findProductDialog") {
      this.findProductDialog = !this.findProductDialog
    }
    if (dialogName === "updateProductDialog") {
      this.updateProductDialog = !this.updateProductDialog
    }
  }
  goToPage(index: number) {
    this.activeIndex = index;
    // this.toasterService.info(this.activeIndex.toString())
  }

  //--------------------------------------------------------------------------- TEKLİF KODLAR YENİ***

  invoiceProcess: InvoiceProcess;
  processId: string;
  processCode: string;

  //--------------------------------------------------------------------------- TEKLİF KODLARI ESKİ**
  proposalId: number;
  brands: any[] = []
  itemCodes: any[] = []
  shelfNos: any[] = []
  descriptions: any[] = []
  productHierarchyLevel01s: any[] = []
  productHierarchyLevel02s: any[] = []
  productHierarchyLevel03s: any[] = []
  allProducts: FastTransfer_VM[] = [];

  logFilteredData(event: any) {

    try {
      if (event.filteredValue) {
        console.log('Filtered data:', event.filteredValue);
        var list: FastTransfer_VM[] = event.filteredValue;
        this.mapProducts(list)

        this.toasterService.info("Dinamik Search Güncellendi")
      }

    } catch (error) {
      this.toasterService.error(error.message)
    }

  }

  async getAllProducts() {
    if (this.allProducts.length == 0) {
      this.allProducts = await this.productService.searchProduct5();

    }
    this.toasterService.success('Tüm Ürünler Getirildi')
    this.mapProducts(this.allProducts);
    this.openDialog('findProductDialog');
  }

  mapProducts(data: FastTransfer_VM[]) {
    const uniqueMap = (array, key) => {
      const map = new Map();
      array.forEach(item => {
        if (!map.has(item[key])) {
          map.set(item[key], { label: item[key], value: item[key] });
        }
      });
      return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
    };

    this.shelfNos = uniqueMap(data, 'shelfNo');
    this.brands = uniqueMap(data, 'brand');
    this.itemCodes = uniqueMap(data, 'itemCode');
    // this.targetShelfs = uniqueMap(this.__transferProducts, 'targetShelf');
    this.descriptions = uniqueMap(data, 'description');
    this.productHierarchyLevel01s = uniqueMap(data, 'productHierarchyLevel01');
    this.productHierarchyLevel02s = uniqueMap(data, 'productHierarchyLevel02');
    this.productHierarchyLevel03s = uniqueMap(data, 'productHierarchyLevel03');
  }

  addedProducts: ZTMSG_ProposalProduct[] = []
  proposal: ZTMSG_Proposal = new ZTMSG_Proposal();
  async addProposal() {


    var request: ZTMSG_Proposal = new ZTMSG_Proposal();
    request.id = this.proposalId;
    request.discountRate1 = 0;
    request.discountRate2 = 0;
    request.userId = Number(localStorage.getItem('userId'));

    var response: ZTMSG_Proposal = await this.productService.addProposal(request);

    if (response) {
      this.proposal = response;
      this.proposalId = response.id;
      // await this.getProposalProducts();
      this.toasterService.success('Oluşturuldu')
      this.generalService.beep();
    } else {
      this.toasterService.error('Oluşturulamadı')
    }

  }
  async deleteProposal(id: number) {
    const confirmed = window.confirm('Bu teklifi silmek istediğinizden emin misiniz?');
    if (confirmed) {
      try {
        const response = await this.productService.deleteProposal(id);
        if (response) {
          this.toasterService.success('Silindi');
          this.router.navigate(['/proposal-list']);
        } else {
          this.toasterService.error('Silinemedi');
        }
      } catch (error) {
        console.error('Error deleting proposal', error);
        this.toasterService.error('Silinemedi');
      }
    }
  }

  async updatePropoosal(request: ZTMSG_Proposal) {
    var response: ZTMSG_Proposal = await this.productService.updateProposal(request);

    if (response) {

      this.proposal = response;
      this.proposalId = response.id;
      // await this.getProposalProducts();
      this.toasterService.success('Güncelleştirildi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Güncelleştirilemedi')
    }
  }
  async addProduct(product: FastTransfer_VM) {
    //toptan fiyat ve tr giyat alıncak
    //buradada db ye ekle sonra çek
    var request: BarcodeSearch_RM = new BarcodeSearch_RM(product.barcode);
    const productDetail = await this.productService._searchProduct(request);
    product.brand = "Polar";
    if (productDetail) {

      const proposalProduct = new ZTMSG_ProposalProduct();
      proposalProduct.id = 0; // Varsayılan bir değer, ya da uygun bir değer belirleyin
      proposalProduct.proposalId = this.proposalId; // Uygun bir GUID değeri be  lirleyin
      proposalProduct.photoUrl = product.photoUrl;
      proposalProduct.barcode = product.barcode;
      proposalProduct.itemCode = product.itemCode;
      proposalProduct.quantity = 1;
      proposalProduct.brand = product.brand;
      proposalProduct.inventory = product.inventory;
      proposalProduct.price = product.price ? parseFloat(product.price) : null;
      proposalProduct.discountedPrice = product.price ? parseFloat(product.price) : null;
      proposalProduct.description = product.description;
      proposalProduct.discountRate1 = 0;
      proposalProduct.discountRate2 = 0;

      proposalProduct.taxRate = 10;
      var taxed_price = (proposalProduct.discountedPrice * (1 + (proposalProduct.taxRate / 100)));
      proposalProduct.totalTaxedPrice = proposalProduct.quantity * taxed_price;
      proposalProduct.totalPrice = proposalProduct.quantity *
        (
          (proposalProduct.discountedPrice * ((100 - proposalProduct.discountRate1) / 100)) - proposalProduct.discountRate2
        )
      var response = await this.productService.addProposalProduct(proposalProduct);
    }

    if (response) {
      await this.getProposalProducts();
      this.toasterService.success('Eklendi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Eklenmedi')
    }


  }

  async deleteProposalProduct(id: number) {

    var response = await this.productService.deleteProposalProduct(id);
    if (response) {
      await this.getProposalProducts();
      this.toasterService.success('Silindi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Silinemedi')
    }
  }
  async updateProposalProduct(product: ZTMSG_ProposalProduct) {
    product.discountedPrice = this.updateProductForm.get('price').value;
    product.quantity = this.updateProductForm.get('quantity').value;
    product.discountRate1 = this.updateProductForm.get('discountRate1').value; //yüzde
    product.discountRate2 = this.updateProductForm.get('discountRate2').value;
    product.totalPrice =
      product.quantity *
      (
        (product.discountedPrice * ((100 - product.discountRate1) / 100)) - product.discountRate2
      )

    product.totalTaxedPrice =
      product.quantity *
      (
        ((product.discountedPrice * (1 + (product.taxRate / 100))) * ((100 - product.discountRate1) / 100)) - product.discountRate2
      )
    var response = await this.productService.updateProposalProduct(product);
    if (response) {
      this.getTotalPrice2();
      await this.getProposalProducts();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
      this.updateProductDialog = false
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }

  async refreshProposalProduct(product: ZTMSG_ProposalProduct) {
    product.discountedPrice = product.price;
    product.quantity = product.quantity;
    product.discountRate1 = 0;
    product.discountRate2 = 0;

    product.totalPrice = (product.quantity * ((product.discountedPrice * ((100 - product.discountRate1) / 100)) - product.discountRate2))
    var response = await this.productService.updateProposalProduct(product);
    if (response) {
      await this.getProposalProducts();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }
  async getProposalProducts() {
    if (this.proposal.id) {
      this.addedProducts = await this.productService.getProposalProducts(this.proposalId?.toString());
      if (this.addedProducts.length == 0) {
        this.proposal.discountRate1 = 0;
        this.proposal.discountRate2 = 0;
        await this.updatePropoosal(this.proposal);
      }
    }

  }

  selectedProduct: ZTMSG_ProposalProduct;
  openUpdateDialog(product: ZTMSG_ProposalProduct) {
    this.selectedProduct = product;
    this.updateProductForm.get('price').setValue(this.selectedProduct.discountedPrice)
    this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity)
    this.updateProductForm.get('discountRate1').setValue(this.selectedProduct.discountRate1)
    this.updateProductForm.get('discountRate2').setValue(this.selectedProduct.discountRate2)

    this.openDialog('updateProductDialog');
    this.getTotalPrice();
    this.getTotalPrice2();
  }

  currentDiscountRate: number = 0;
  selectedSize: any = '';

  percentDiscountRate: number;
  cashDiscountRate: number;
  async discount(discountAmount: number) {

    if (discountAmount >= 0 && discountAmount <= 100) {
      this.proposal.discountRate1 = discountAmount;
      var response: ZTMSG_Proposal = await this.productService.updateProposal(this.proposal);
      if (response) {
        this.proposal = response;

        // await this.getProposalProducts();
        // await this.getProposalProducts();
        this.toasterService.success('Güncellendi')
        this.generalService.beep();
      } else {
        this.toasterService.error('Güncellenmedi')
      }
    } else {
      this.toasterService.error('1 ile 100 arasında bir değer giriniz.')
    }


  }
  currentCashdiscountRate: number = 0;
  async cashDiscount(discountAmount: number) {

    this.proposal.discountRate2 = discountAmount;
    var response: ZTMSG_Proposal = await this.productService.updateProposal(this.proposal);
    if (response) {
      this.proposal = response;

      // await this.getProposalProducts();
      this.getTotalPrice2();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }

  async resetDiscount() {
    this.proposal.discountRate2 = 0;
    this.proposal.discountRate1 = 0
    var response: ZTMSG_Proposal = await this.productService.updateProposal(this.proposal);
    if (response) {
      this.proposal = response;

      this.getTotalPrice2();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Güncellenmedi')
    }

  }

  createGetProductForm() {
    this.getProductsForm = this.formBuilder.group({
      barcode: [null],
      shelfNo: [null]
      // stockCode: [null],
    });
  }

  async createProposalReport() {

    // if (window.confirm("Teklifi Oluşturmak İstediğinize Emin Misiniz?")) {
    //   var data = await this.productService.createProposalReport(this.proposal.id);


    // }
  }
  async deleteAllPRoduct() {
    if (confirm("Tüm Ürünleri Silmek İstediğinize Emin Misiniz?")) {
      this.addedProducts.forEach(async p => {
        await this.deleteProposalProduct(p.id);
      });
    }
    this.getTotalPrice();
    this.getTotalPrice2();

  }
  findCustomerDialog = false;
  customerNames: any[] = [];
  emails: any[] = [];
  phones: any[] = [];
  _descriptions: any[] = [];
  docCurrencyCodes: any[] = [];
  mapCustomers(data: CustomerList_VM[]) {
    const uniqueMap = (array, key) => {
      const map = new Map();
      array.forEach(item => {
        const value = item[key];
        if (value !== null && value !== undefined && !map.has(value)) {
          map.set(value, { label: value, value: value });
        }
      });
      return Array.from(map.values()).sort((a, b) => {
        if (a.label === null || a.label === undefined) return 1;
        if (b.label === null || b.label === undefined) return -1;
        return a.label.localeCompare(b.label);
      });
    };

    this.customerNames = uniqueMap(data, 'currAccCode');
    this._descriptions = uniqueMap(data, 'currAccDescription');
    this.emails = uniqueMap(data, 'mail');
    this.phones = uniqueMap(data, 'phone');
    this.docCurrencyCodes = uniqueMap(data, 'docCurrencyCode');
  }

  async getAllCustomers() {
    if (this._selectableCustomers.length > 0) {
      this.findCustomerDialog = true;
    } else {
      var _request: GetCustomerList_CM = new GetCustomerList_CM();
      _request.currAccCode = null;
      _request.mail = null;
      _request.phone = null;
      this._selectableCustomers = await this.customerService.getCustomerList_2(_request)
      this.mapCustomers(this._selectableCustomers);
      this.findCustomerDialog = true;
    }
  }
  async addCustomer(customer: CustomerList_VM) {
    this.proposal.currAccDescription = customer.currAccDescription;
    await this.updatePropoosal(this.proposal);
    this.findCustomerDialog = false;
  }
  logFilteredData2(event: any) {

    // try {
    //   if (event.filteredValue) {

    //     var list: CustomerList_VM[] = event.filteredValue;
    //     this.mapCustomers(list)

    //     this.toasterService.info("Dinamik Search Güncellendi")
    //   }

    // } catch (error) {
    //   this.toasterService.error(error.message)
    // }

  }

  //---------------------------------------------------- TOTAL FUNCS

  getTotalPrice() {
    var number = this.addedProducts.reduce((acc, product) => acc + product.totalPrice, 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
  }
  //dip iskonto uygulandıktan sonraki fiyatı çeker
  getTotalPrice2() {
    return this.addedProducts.reduce((acc, product) => acc + product.totalTaxedPrice, 0) * ((100 - this.proposal.discountRate1) / 100) - this.proposal.discountRate2;

  } getTotalQuantity(): number {
    return this.addedProducts.reduce((acc, product) => acc + product.quantity, 0);
  }

  getTotalTax(): number {
    return this.addedProducts.reduce((acc, product) => acc + (product.totalPrice * (product.taxRate / 100)), 0);
  }
  getTotal(): number {
    return this.addedProducts.reduce((acc, product) => acc + product.totalPrice, 0);
  }
  //dip iskonto uygulanmadan önceki fiyatı çeker
  getTotalTaxedPrice(): number {
    var total = this.addedProducts.reduce((acc, product) => acc + product.totalTaxedPrice, 0);
    return parseFloat(total.toFixed(2));
  }
  getTotalPriceWithTax() {

    var number = this.selectedProducts.reduce((acc, product) => acc + (product.quantity * product.discountedPrice * (product.taxRate / 100)), 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
  }
}
