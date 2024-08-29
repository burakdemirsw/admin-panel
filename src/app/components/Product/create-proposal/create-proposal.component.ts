import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';
import { FileUpload } from 'primeng/fileupload';
import { SubCustomerList_VM } from 'src/app/models/model/customer/subCustomerList_VM';
import { CreateCustomer_CM } from 'src/app/models/model/order/createCustomer_CM';
import { ExchangeRate } from 'src/app/models/model/order/exchangeRate';
import { CustomerAddress_VM, CustomerList_VM, GetCustomerList_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { Payment } from 'src/app/models/model/order/nebimOrder';
import { Address_VM } from 'src/app/models/model/order/ViewModel/provinceVM';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import { ZTMSG_Proposal, ZTMSG_ProposalProduct } from 'src/app/models/model/product/proposalProduct';
import { FastTransfer_VM } from 'src/app/models/model/warehouse/transferRequestListModel';
import { AddressService } from 'src/app/services/admin/address.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { GoogleDriveService } from 'src/app/services/common/google-drive.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrl: './create-proposal.component.css'
})
export class CreateProposalComponent implements OnInit {



  [x: string]: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  selectedCustomers: CustomerList_VM[] = []
  selectedProducts: ProductList_VM[] = []
  selectedAddresses: CustomerAddress_VM[] = []
  selectedOfficeAndWarehosue: any[] = [];
  selectedSubCustomers: SubCustomerList_VM[] = [];
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
    private warehouseService: WarehouseService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private googleDriveService: GoogleDriveService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private addressService: AddressService
  ) { }

  async ngOnInit() {
    this.createUpdateProductForm()
    this.createCustomerFormMethod()
    this.getAddresses();
    this.orderType = true;
    this.pageTitle = "Teklif Oluştur"

    await this.getProposalProducts();

    this.activatedRoute.params.subscribe(async (params) => {
      if (params['id']) {
        this.proposalId = params['id']
        await this.addProposal();
        await this.getProposalProducts();
      }
    })
    this.headerService.updatePageTitle(this.pageTitle);
    this.createDiscountForm();


  }

  chooseFile() {
    this.fileInput.nativeElement.click();
  }
  createUpdateProductForm() {
    this.updateProductForm = this.formBuilder.group({
      description: [null, Validators.required],
      price: [null, Validators.required],
      discountedPrice: [null, Validators.required],

      quantity: [null, Validators.required],
      discountRate1: [null, Validators.required],
      discountRate2: [null, Validators.required],
      brand: [null, Validators.required],
      itemCode: [null, Validators.required],
      barcode: [null, Validators.required],

    });
  }
  createDiscountForm() {

    this.discountForm = this.formBuilder.group({
      cashDiscountRate: [null, Validators.required],
      percentDiscountRate: [null, Validators.required]
    });
  }
  async routeGetProduct(request: string) {

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
  selectAddressDialog: boolean = false;
  subCustomerDialog: boolean = false;
  addSubCustomerDialog: boolean = false;
  quantityListDialog: boolean = false;
  openDialog(dialogName: string) {
    if (dialogName === "getCustomerDialog") {
      this.getCustomerDialog = !this.getCustomerDialog
    }
    if (dialogName === "findProductDialog") {
      this.findProductDialog = !this.findProductDialog
    }
    if (dialogName === "addSubCustomerDialog") {
      this.addSubCustomerDialog = !this.addSubCustomerDialog
    }
    if (dialogName === "quantityListDialog") {
      this.quantityListDialog = !this.quantityListDialog
    }

    if (dialogName === "updateProductDialog") {
      this.updateProductDialog = !this.updateProductDialog
    }
  }
  goToPage(index: number) {
    this.activeIndex = index;
    // this.toasterService.info(this.activeIndex.toString())
  }

  //--------------------------------------------------------------------------- TEKLİF KODLAR
  barcode: string;
  proposalId: number;
  brands: any[] = []
  itemCodes: any[] = []
  shelfNos: any[] = []
  // targetShelfs: any[] = []
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

  async getAllProducts(showDialog: boolean) {
    if (this.allProducts.length == 0) {
      this.allProducts = await this.productService.searchProduct5();

    }
    this.toasterService.success('Tüm Ürünler Getirildi')
    this.mapProducts(this.allProducts);
    if (showDialog) {

      this.openDialog('findProductDialog');
    }
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
    request.id = this.proposalId ?? 0;
    request.discountRate1 = 0;
    request.discountRate2 = 0;
    request.userId = Number(localStorage.getItem('userId'));


    var response: ZTMSG_Proposal = await this.productService.addProposal(request);

    if (response) {
      this.proposal = response;
      this.proposalId = response.id;
      // await this.getProposalProducts();
      this.toasterService.success('Oluşturuldu')
      // //this.generalService.beep();
      this.router.navigate(["create-proposal", response.id])
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
      //this.generalService.beep();
    } else {
      this.toasterService.error('Güncelleştirilemedi')
    }
  }
  async addProduct(product: FastTransfer_VM) {
    //toptan fiyat ve tr giyat alıncak
    //buradada db ye ekle sonra çek

    if (!this.proposalId) {
      await this.addProposal();
    }
    var request: BarcodeSearch_RM = new BarcodeSearch_RM(product.barcode);
    const productDetail = await this.productService.searchProduct(request);
    if (productDetail) {
      product.price = productDetail[0].basePrice;
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

      proposalProduct.taxRate = productDetail[0].taxRate;
      var taxed_price = (proposalProduct.discountedPrice * (1 + (proposalProduct.taxRate / 100)));
      proposalProduct.totalTaxedPrice = proposalProduct.quantity * taxed_price;
      proposalProduct.totalPrice = proposalProduct.quantity *
        (
          (proposalProduct.discountedPrice * ((100 - proposalProduct.discountRate1) / 100)) - proposalProduct.discountRate2
        )

      proposalProduct.totalTaxedPrice = proposalProduct.quantity *
        (
          (proposalProduct.totalTaxedPrice * ((100 - proposalProduct.discountRate1) / 100)) - proposalProduct.discountRate2
        )
      proposalProduct.totalTaxedPrice = parseFloat(proposalProduct.totalTaxedPrice.toFixed(2));

      var response = await this.productService.addProposalProduct(proposalProduct);
    }

    if (response) {
      await this.getProposalProducts();
      this.toasterService.success('Eklendi')
      //this.generalService.beep();
    } else {
      this.toasterService.error('Eklenmedi')
    }


  }
  async addProductFromInput(barcode) {

    if (this.allProducts.length <= 0) {
      await this.getAllProducts(false);
    }
    var product = this.allProducts.find(p => p.barcode == barcode || p.itemCode == barcode)
    await this.addProduct(product);
  }

  async deleteProposalProduct(id: number) {

    var response = await this.productService.deleteProposalProduct(id);
    if (response) {
      await this.getProposalProducts();
      this.toasterService.success('Silindi')
      //this.generalService.beep();
    } else {
      this.toasterService.error('Silinemedi')
    }
  }
  async updateProposalProduct(product: ZTMSG_ProposalProduct) {
    product.description = this.updateProductForm.get('description').value;
    product.discountedPrice = this.updateProductForm.get('discountedPrice').value;
    product.price = this.updateProductForm.get('price').value;
    product.quantity = this.updateProductForm.get('quantity').value;
    product.discountRate1 = this.updateProductForm.get('discountRate1').value; //yüzde
    product.discountRate2 = this.updateProductForm.get('discountRate2').value;
    product.brand = this.updateProductForm.get('brand').value
    product.itemCode = this.updateProductForm.get('itemCode').value
    product.barcode = this.updateProductForm.get('barcode').value

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
      this.getTaxedTotalAfterDiscount();
      await this.getProposalProducts();
      this.toasterService.success('Güncellendi')
      //this.generalService.beep();
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
      //this.generalService.beep();
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }

  async deletePhoto(product: ZTMSG_ProposalProduct) {
    product.photoUrl = null;
    var response = await this.productService.updateProposalProduct(product);
    if (response) {
      await this.getProposalProducts();
      this.toasterService.success('Güncellendi')
      //this.generalService.beep();
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
    this.updateProductForm.get('description').setValue(this.selectedProduct.description)
    this.updateProductForm.get('price').setValue(this.selectedProduct.price)
    this.updateProductForm.get('discountedPrice').setValue(this.selectedProduct.discountedPrice)
    this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity)
    this.updateProductForm.get('discountRate1').setValue(this.selectedProduct.discountRate1)
    this.updateProductForm.get('discountRate2').setValue(this.selectedProduct.discountRate2)
    this.updateProductForm.get('brand').setValue(this.selectedProduct.brand)
    this.updateProductForm.get('itemCode').setValue(this.selectedProduct.itemCode)
    this.updateProductForm.get('barcode').setValue(this.selectedProduct.barcode)

    this.openDialog('updateProductDialog');
    this.getUntaxedTotal();
    this.getTaxedTotalAfterDiscount();
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
        this.toasterService.success('Güncellendi')
        //this.generalService.beep();
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
      this.getTaxedTotalAfterDiscount();
      this.toasterService.success('Güncellendi')
      //this.generalService.beep();
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

      this.getTaxedTotalAfterDiscount();
      this.toasterService.success('Güncellendi')
      //this.generalService.beep();
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

    if (window.confirm("Mail Gönderilsin mi?")) {
      var data = await this.orderService.createProposalReport(this.proposal.id, true);
    } else {
      var data = await this.orderService.createProposalReport(this.proposal.id, false);
    }
  }
  async deleteAllPRoduct() {
    if (confirm("Tüm Ürünleri Silmek İstediğinize Emin Misiniz?")) {
      this.addedProducts.forEach(async p => {
        await this.deleteProposalProduct(p.id);
      });
    }
    this.getUntaxedTotal();
    this.getTaxedTotalAfterDiscount();

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
        if (!map.has(item[key])) {
          map.set(item[key], { label: item[key], value: item[key] });
        }
      });
      return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
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
      this._selectableCustomers = await this.orderService.getCustomerList_2(_request)
      this.mapCustomers(this._selectableCustomers);
      this.findCustomerDialog = true;
    }
  }
  async addCustomer(customer: CustomerList_VM) {
    this.proposal.currAccDescription = customer.currAccDescription;
    this.proposal.currAccCode = customer.currAccCode;
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

  findVatRate(vatRate: number): boolean {
    return this.addedProducts.some(p => p.taxRate == vatRate)
  }
  calculateVatAmount(vatRate: number): number {
    // First, calculate the total discount rate to apply to each product
    const totalDiscountRate = this.proposal.discountRate1 || 0; // percentage discount
    const cashDiscount = this.proposal.discountRate2 || 0; // cash discount

    return Number(this.addedProducts
      .filter(p => p.taxRate === vatRate) // Filter products with the specified VAT rate
      .reduce((total, product) => {
        // Apply percentage discount
        let discountedPrice = product.totalPrice * (1 - totalDiscountRate / 100);

        // Apply cash discount proportionally based on product price
        discountedPrice -= cashDiscount * (product.totalPrice / this.getUntaxedTotal());

        // Calculate VAT based on the final discounted price
        return total + (discountedPrice * product.taxRate / 100);
      }, 0).toFixed(2)); // Sum the VAT amounts and round to 2 decimal places sadas
  }

  //vergisiz tutarların iskontodan sonraki hali
  getUnTaxedTotalAfterDiscount() {
    var number = this.addedProducts.reduce((acc, product) => acc + product.totalPrice, 0);
    number = ((number * ((100 - this.proposal.discountRate1) / 100)) - this.proposal.discountRate2)
    if (number.toString().includes('.')) {
      return Number(number)
    } else {
      return number
    }
  }

  //vergisiz tutarların toplamı
  getUntaxedTotal() {
    var number = this.addedProducts.reduce((acc, product) => acc + product.totalPrice, 0);
    if (number.toString().includes('.')) {
      return Number(number)
    } else {
      return number
    }
  }
  //dip iskonto uygulandıktan sonraki fiyatı çeker
  getTaxedTotalAfterDiscount() {
    return this.addedProducts.reduce((acc, product) => acc + product.totalTaxedPrice, 0) * ((100 - this.proposal.discountRate1) / 100) - this.proposal.discountRate2;

  } getTotalQuantity(): number {
    return this.addedProducts.reduce((acc, product) => acc + product.quantity, 0);
  }

  calculateNetTaxedPrice(product: ZTMSG_ProposalProduct, proposal: ZTMSG_Proposal): number {
    const lineDiscountedPrice = (product.price || 0) * (1 - product.discountRate1 / 100) - product.discountRate2;
    const generalDiscountedPrice = lineDiscountedPrice * (1 - (proposal.discountRate1 || 0) / 100) - (proposal.discountRate2 || 0);
    const totalPrice = generalDiscountedPrice * product.quantity;
    const totalTaxedPrice = totalPrice * (1 + product.taxRate / 100);
    return parseFloat(totalTaxedPrice.toFixed(2));
  }


  getTotalTax_2(): number {
    return this.addedProducts.reduce((acc, product) => acc + ((product.totalPrice * (product.taxRate / 100))), 0);
  }

  getTotalTax(): number {


    return this.getTaxedTotalAfterDiscount() - this.getUnTaxedTotalAfterDiscount();
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
  getUntaxedTotalWithTax() {

    var number = this.selectedProducts.reduce((acc, product) => acc + (product.quantity * product.discountedPrice * (product.taxRate / 100)), 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
  }

  //------------------------------FOTOĞRAF EKLEME KODLARI
  selectedFiles_2: File[] = [];
  //----------------------------MÜŞTERİ KODLARI

  async onUpload_2(event: any, product: ZTMSG_ProposalProduct) {
    this.selectedProduct = product;
    this.selectedFiles_2 = [];
    // this.toasterService.info(to);
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const selectedFile: File = files[i];
      this.selectedFiles.push(selectedFile);
      this.toasterService.success("İşlem Başarılı");
      await this.addPicture_2(selectedFile, product);
    }
    event.target.value = "";
  }

  async addPicture_2(file: File, product: ZTMSG_ProposalProduct) {
    const response = await this.googleDriveService.addPicture(file);
    for (const p of this.addedProducts) {
      if (p.id === product.id) {
        p.photoUrl = response.url;
        await this.productService.updateProposalProduct(product);
      }
    }
    console.log(response);
  }

  createCustomerDialog: boolean = false;
  createCustomerForm: FormGroup;
  selectedFiles: File[] = [];

  addressForm: FormGroup
  countries: Address_VM[] = []
  provinces: Address_VM[] = []
  districts: Address_VM[] = []
  regions: Address_VM[] = []
  taxOffices: Address_VM[] = []
  updated_districts: Address_VM[] = []
  _regions: any[] = []
  _taxOffices: any = []
  _countries: any[] = []
  _provinces: any[] = []
  _districts: any[] = []
  _neighborhoods: any[] = []



  async onUpload(event: any, to: string) {
    this.selectedFiles = [];
    // this.toasterService.info(to);
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const selectedFile: File = files[i];
      this.selectedFiles.push(selectedFile);
      this.toasterService.success("İşlem Başarılı");
      await this.addPicture(selectedFile, to);
    }
    event.target.value = "";
  }

  async addPicture(file: File, to: string) {
    var response = await this.googleDriveService.addPicture(file);

    if (to === "bussinesCardPhotoUrl") {

      this.createCustomerForm.get("bussinesCardPhotoUrl").setValue(response.url);

    } if (to === "stampPhotoUrl") {

      this.createCustomerForm.get("stampPhotoUrl").setValue(response.url);

    }
  }
  async submitAddressForm(formValue: any) {
    // eğer form geçerli ise **
    if (this.createCustomerForm.valid) {
      var request: CreateCustomer_CM = new CreateCustomer_CM();
      request.currAccDescription = formValue.currAccDescription; //++
      request.mail = formValue.mail;
      request.phoneNumber = formValue.phoneNumber;
      request.firmDescription = formValue.currAccDescription;
      request.stampPhotoUrl = formValue.stampPhotoUrl;
      request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
      request.officeCode = 'M'
      request.warehouseCode = 'MD'

      if (!formValue.address_country) {
        request.address = null
      } else {
        request.address.country = formValue.address_country;
        request.address.province = formValue.address_province;
        request.address.district = formValue.address_district;
        request.address.region = formValue.address_region;
        request.address.taxOffice = formValue.address_taxOffice;
        request.address.description = formValue.address_description;
        request.address.postalCode = formValue.address_postalCode;
      }
      var response = await this.orderService.createCustomer(request);
      if (response.currAccCode) {
        await this.getAllCustomers();
        var customer = this._selectableCustomers.find(c => c.currAccCode == response.currAccCode);

        if (customer) {
          await this.addCustomer(customer);
          this.toasterService.error("Müşteri Seçildi")
          this.createCustomerDialog = false;

        } else {
          this.toasterService.error("Müşteri Bulunamadı")
        }


      }
    } else {
      this.generalService.whichRowIsInvalid(this.createCustomerForm)
    }

  }

  async getAddresses() {
    // Ülkelerin adres bilgilerini al
    var countries = await this.addressService.getAddress(1);
    // Ülkeleri döngüye alarak dönüştür ve _countries dizisine ekle
    this._countries = countries.map((b) => {
      return { name: b.description, code: b.code };
    });

    // Region'ların adres bilgilerini al (örneğin Türkiye)
    var regions = await this.addressService.getAddress(2, "TR");
    // Region'ları döngüye alarak dönüştür ve _regions dizisine ekle
    this._regions = regions.map((b) => {
      return { name: b.description, code: b.code };
    });
  }

  createCustomerFormMethod() {
    this.createCustomerForm = this.formBuilder.group({
      office: [null],
      warehouse: [null],
      salesPersonCode: [null],
      currAccDescription: [null, Validators.required],
      mail: [' ', Validators.required],
      phoneNumber: ['05', [Validators.required]],
      stampPhotoUrl: [null],
      bussinesCardPhotoUrl: [null],
      cargoAddressPhotoUrl: [null],
      address_country: [null],
      address_province: [null],
      address_district: [null],
      address_region: [null],
      taxNumber: [null],
      address_description: [null],
      address_postalCode: [' '],
      address_taxOffice: [null],
      sc_Description: [null],
      sc_mode: [false],
    });


    this.createCustomerForm.get('address_region').valueChanges.subscribe(async (value) => { //illeri getir
      var _value = this.createCustomerForm.get('address_region').value;
      var response = await this.addressService.getAddress(3, _value)
      this.provinces = response

      this._provinces = [];
      this.provinces.forEach((b) => {
        var provinces: any = { name: b.description, code: b.code };
        this._provinces.push(provinces);
      });
    });

    this.createCustomerForm.get('address_province').valueChanges.subscribe(async (value) => { //ilçeleri getir
      var _value = this.createCustomerForm.get('address_province').value;

      var response = await this.addressService.getAddress(4, _value)
      this.districts = response

      this._districts = [];
      this.districts.forEach((b) => {
        var district: any = { name: b.description, code: b.code };
        this._districts.push(district);
      });


      var _value = this.createCustomerForm.get('address_province').value;

      var response = await this.addressService.getAddress(5, _value)
      this.taxOffices = response

      this._taxOffices = [];
      this.taxOffices.forEach((b) => {
        var taxOffice: any = { name: b.description, code: b.code };
        this._taxOffices.push(taxOffice);
      });


    });

  }
}
