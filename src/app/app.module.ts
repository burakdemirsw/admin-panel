
import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgxPopper } from 'angular-popper';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ImageModule } from 'primeng/image';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './components/auth/authorization/authorization.component';
import { CargoDetailComponent } from './components/cargo/cargo-detail/cargo-detail.component';
import { CargoListComponent } from './components/cargo/cargo-list/cargo-list.component';
import { CreateArasCargoBarcodeComponent } from './components/cargo/create-aras-cargo-barcode/create-aras-cargo-barcode.component';
import { CreateCargoComponent } from './components/cargo/create-cargo/create-cargo.component';
import { CategoryManagamentComponent } from './components/Category/category-managament/category-managament.component';
import { CategoryOperationComponent } from './components/Category/category-operation/category-operation.component';
import { AddCustomerComponent } from './components/Customer/add-customer/add-customer.component';
import { CustomerListComponent } from './components/Customer/customer-list/customer-list.component';
import { DevolopmentListComponent } from './components/Devolopment/devolopment-list/devolopment-list.component';
import { TaskPanelsComponent } from './components/Devolopment/devolopment-list/task-panels/task-panels.component';
import { CreatePurchaseOrderComponent } from './components/Invoice/create-purchase-order/create-purchase-order.component';
import { CreateSaleOrderComponent } from './components/Invoice/create-sale-order/create-sale-order.component';
import { InvoiceListComponent } from './components/Invoice/invoice-list/invoice-list.component';
import { LogManagamentComponent } from './components/Log/log-managament/log-managament.component';
import { TransferredOrdersComponent } from './components/marketplace/transferred-orders/transferred-orders.component';
import { CollectedPackageDetailComponent } from './components/Order/collected-package-detail/collected-package-detail.component';
import { CollectedPackagesComponent } from './components/Order/collected-packages/collected-packages.component';
import { CreateOrderComponent } from './components/Order/create-order/create-order.component';
import { CollectExportProductsComponent } from './components/Order/export-transactions/collect-export-products/collect-export-products.component';
import { ExportTransactionsComponent } from './components/Order/export-transactions/export-transactions.component';
import { ImportTransactionsComponent } from './components/Order/import-transactions/import-transactions.component';
import { MarketplaceInvoicesComponent } from './components/Order/marketplace-invoices/marketplace-invoices.component';
import { NebimGetOrdersComponent } from './components/Order/nebim-get-orders/nebim-get-orders.component';
import { OrderBillingOperationComponent } from './components/Order/order-billing-operation/order-billing-operation.component';
import { OrderManagamentComponent } from './components/Order/order-managament/order-managament.component';
import { OrderOperationComponent } from './components/Order/order-operation/order-operation.component';
import { OrderStateComponent } from './components/Order/order-state/order-state.component';
import { PurchaseOrderManagamentComponent } from './components/Order/purchase-order-managament/purchase-order-managament.component';
import { SaleOrderManagamentComponent } from './components/Order/sale-order-managament/sale-order-managament.component';
import { UnfinishedOrderComponent } from './components/Order/unfinished-order/unfinished-order.component';
import { CreateBarcodeComponent } from './components/Product/create-barcode/create-barcode.component';
import { CreateQrComponent } from './components/Product/create-qr/create-qr.component';
import { NebimProductExtractComponent } from './components/Product/nebim-product-extract/nebim-product-extract.component';
import { NebimStockControlComponent } from './components/Product/nebim-stock-control/nebim-stock-control.component';
import { ProductManagementComponent } from './components/Product/product-management/product-management.component';
import { ProductOperationComponent } from './components/Product/product-operation/product-operation.component';
import { ProductStockReportComponent } from './components/Product/product-stock-report/product-stock-report.component';
import { ReadBarcodeComponent } from './components/Product/read-barcode/read-barcode.component';
import { SearchQrComponent } from './components/Product/search-qr/search-qr.component';
import { SearchShelfComponent } from './components/Product/search-shelf/search-shelf.component';
import { CreateProposalComponent } from './components/proposal/create-proposal/create-proposal.component';
import { ProposalListComponent } from './components/proposal/proposal-list/proposal-list.component';
import { ShelveOperationComponent } from './components/Shelf/shelve-operation/shelve-operation.component';
import { ShelvesManagamentComponent } from './components/Shelf/shelves-managament/shelves-managament.component';
import { IdeasoftOffersComponent } from './components/special-panels/ideasoft-offers/ideasoft-offers.component';
import { RoleListComponent } from './components/User/user-list/role/role-list/role-list.component';
import { UserListComponent } from './components/User/user-list/user-list.component';
import { BoxCountComponent } from './components/Warehouse/box-count/box-count.component';
import { FastTransferListComponent } from './components/Warehouse/fast-transfer/fast-transfer-list/fast-transfer-list.component';
import { FastTransferComponent } from './components/Warehouse/fast-transfer/fast-transfer.component';
import { ShelfTransferRequestComponent } from './components/Warehouse/shelf-transfer-request/shelf-transfer-request.component';
import { ShelfComponent } from './components/Warehouse/shelf/shelf.component';
import { AddProductToShelfListComponent } from './components/Warehouse/warehosue-shelf-count/add-product-to-shelf-list/add-product-to-shelf-list.component';
import { AddProductToShelfComponent } from './components/Warehouse/warehosue-shelf-count/add-product-to-shelf/add-product-to-shelf.component';
import { WarehosueShelfCountComponent } from './components/Warehouse/warehosue-shelf-count/warehosue-shelf-count.component';
import { WarehouseOperationConfirmDetailComponent } from './components/Warehouse/warehouse-operation/warehouse-operation-confirm-detail/warehouse-operation-confirm-detail.component';
import { WarehouseOperationListComponent } from './components/Warehouse/warehouse-operation/warehouse-operation-list/warehouse-operation-list.component';
import { WarehouseOperationComponent } from './components/Warehouse/warehouse-operation/warehouse-operation.component';
import { WarehouseShelfCountListComponent } from './components/Warehouse/warehouse-shelf-count-list/warehouse-shelf-count-list.component';
import { WarehouseTransferListComponent } from './components/Warehouse/warehouse-transfer-list/warehouse-transfer-list.component';
import { RetailInvoiceListComponent } from './components2/invoice/retail-invoice-list/retail-invoice-list.component';
import { IdeasoftComponent } from './components2/marketplace/ideasoft/ideasoft.component';
import { CollectProductOfOrderComponent } from './components2/order/collect-product-of-order/collect-product-of-order.component';
import { CollectedPackagesComponent as CollectedPackagesComponent2 } from './components2/order/collected-packages/collected-packages.component';
import { RetailOrderManagementComponent } from './components2/order/retail-order-management/retail-order-management.component';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PagesBlankComponent } from './pages/pages-blank/pages-blank.component';
import { PagesContactComponent } from './pages/pages-contact/pages-contact.component';
import { PagesError404Component } from './pages/pages-error404/pages-error404.component';
import { PagesFaqComponent } from './pages/pages-faq/pages-faq.component';
import { PagesInfoComponent } from './pages/pages-info/pages-info.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { PagesLoginv2Component } from './pages/pages-loginv2/pages-loginv2.component';
import { PagesRegisterComponent } from './pages/pages-register/pages-register.component';
import { UsersProfileComponent } from './pages/users-profile/users-profile.component';
import { FilterShelvesPipe } from './pipes/filter-shelves.pipe';
import { ReferrerPolicyDirective } from './referrer-policy.directive';
import { ExportCsvService } from './services/export-csv.service';
import { FastTransferPipe } from './services/pipes/fast-transfer.pipe';
import { AlertifyService } from './services/ui/alertify.service';
import { HttpErrorInterceptor } from './services/ui/http-error-interceptor.service';
import { CalendarModule } from 'primeng/calendar';
import { TaskPanelComponent } from './components/Devolopment/devolopment-list/task-panel/task-panel.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AutoMaximizeDialogDirective } from './directives/auto-maximize-dialog.directive';
import { UntransferredOrdersComponent } from './components/marketplace/transferred-orders/untransferred-orders/untransferred-orders.component';
import { CreateWarehouseProcessComponent } from './components/Warehouse/warehouse-operation/create-warehouse-process/create-warehouse-process.component';
import { RaportComponent } from './components/raport/raport/raport.component';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeysPipe } from './components/raport/raport/keys.pipe';
import { CustomersComponent } from './components/Customer/customers/customers.component';
@NgModule({

  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    UsersProfileComponent,
    PagesFaqComponent,
    PagesContactComponent,
    PagesRegisterComponent,
    PagesLoginComponent,
    PagesError404Component,
    PagesBlankComponent,
    ProductManagementComponent,
    ProductOperationComponent,
    OrderOperationComponent,
    CategoryOperationComponent,
    OrderManagamentComponent,
    CategoryManagamentComponent,
    ShelvesManagamentComponent,
    ShelveOperationComponent,
    WarehouseOperationComponent,
    OrderBillingOperationComponent,
    FilterShelvesPipe,
    CollectProductOfOrderComponent,
    WarehouseOperationListComponent,
    WarehouseOperationConfirmDetailComponent,
    CollectedPackagesComponent,
    CollectedPackageDetailComponent,
    WarehosueShelfCountComponent,
    SaleOrderManagamentComponent,
    PurchaseOrderManagamentComponent,
    CreatePurchaseOrderComponent,
    CreateSaleOrderComponent,
    ImageModalComponent,
    WarehouseShelfCountListComponent,
    InvoiceListComponent,
    FastTransferComponent,
    CreateQrComponent,
    WarehouseTransferListComponent,
    LogManagamentComponent,
    ShelfTransferRequestComponent,
    SearchQrComponent,
    BoxCountComponent,
    CreateOrderComponent,
    ReferrerPolicyDirective,

    PagesLoginv2Component,
    UserListComponent,
    CustomerListComponent,
    CreateCargoComponent,
    CargoListComponent,
    CargoDetailComponent,
    AddCustomerComponent,
    UnfinishedOrderComponent,
    CreateArasCargoBarcodeComponent,
    DevolopmentListComponent,
    NebimStockControlComponent,
    NebimGetOrdersComponent,
    NebimProductExtractComponent,
    CreateBarcodeComponent,
    FastTransferListComponent,
    FastTransferPipe,
    RetailInvoiceListComponent,
    RetailOrderManagementComponent,
    CollectedPackagesComponent2,
    OrderStateComponent,
    ReadBarcodeComponent,
    IdeasoftComponent,
    MarketplaceInvoicesComponent,
    SearchShelfComponent,
    ImportTransactionsComponent,
    ExportTransactionsComponent,
    CollectExportProductsComponent,
    PagesInfoComponent,
    CreateProposalComponent,
    ProposalListComponent,
    IdeasoftOffersComponent,
    AuthorizationComponent,
    RoleListComponent,
    TaskPanelComponent,
    ShelfComponent,
    ProductStockReportComponent,
    AddProductToShelfComponent,
    AddProductToShelfListComponent,
    TransferredOrdersComponent,
    TaskPanelsComponent,
    AutoMaximizeDialogDirective,
    UntransferredOrdersComponent,
    CreateWarehouseProcessComponent,
    RaportComponent,
    CustomersComponent,
    KeysPipe
  ],


  imports: [
    NgxPopperjsModule,
    ToolbarModule,
    SkeletonModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    BrowserModule,
    FloatLabelModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({ type: 'line-scale-pulse-out' }),
    ZXingScannerModule,
    NgxPaginationModule,
    NgSelectModule,
    QRCodeModule,
    NgxPrintModule,
    ChartModule,
    ListboxModule,
    CommonModule,
    DialogModule,
    ImageModule,
    ToastModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    InputSwitchModule,
    BlockUIModule,
    RadioButtonModule,
    PanelModule,
    TabViewModule,
    CardModule,
    ButtonModule,
    StepsModule,
    ConfirmDialogModule, //asdas
    ChartModule,
    SelectButtonModule,
    SidebarModule,
    TreeModule,
    ContextMenuModule,
    OverlayPanelModule,
    CheckboxModule,
    FileUploadModule,
    TableModule,
    InputTextModule,
    MessagesModule,
    FieldsetModule,
    EditorModule,
    SplitButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('accessToken'),
        allowedDomains: ['localhost:7178', 'localhost:7180', '109.228.239.225:7178', '109.228.239.225:7179'],
      },
    }),

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService, MessageService, AlertifyService, NgModule, NgxPopper, DatePipe, NgxSpinnerModule, ExportCsvService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],

  bootstrap: [AppComponent],
})
export class AppModule { }
