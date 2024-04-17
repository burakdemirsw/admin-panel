import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AlertsComponent } from './components/Others/pagination/alerts/alerts.component';
import { AccordionComponent } from './components/Others/pagination/accordion/accordion.component';
import { BadgesComponent } from './components/Others/pagination/badges/badges.component';
import { BreadcrumbsComponent } from './components/Others/pagination/breadcrumbs/breadcrumbs.component';
import { ButtonsComponent } from './components/Others/pagination/buttons/buttons.component';
import { CardsComponent } from './components/Others/pagination/cards/cards.component';
import { CarouselComponent } from './components/Others/pagination/carousel/carousel.component';
import { ListGroupComponent } from './components/Others/pagination/list-group/list-group.component';
import { ModalComponent } from './components/Others/pagination/modal/modal.component';
import { TabsComponent } from './components/Others/pagination/tabs/tabs.component';
import { PaginationComponent } from './components/Others/pagination/pagination.component';
import { ProgressComponent } from './components/Others/pagination/progress/progress.component';
import { SpinnersComponent } from './components/Others/pagination/spinners/spinners.component';
import { TooltipsComponent } from './components/Others/pagination/tooltips/tooltips.component';
import { FormsElementsComponent } from './components/Others/pagination/forms-elements/forms-elements.component';
import { FormsLayoutsComponent } from './components/Others/pagination/forms-layouts/forms-layouts.component';
import { FormsEditorsComponent } from './components/Others/pagination/forms-editors/forms-editors.component';
import { TablesGeneralComponent } from './components/Others/pagination/tables-general/tables-general.component';
import { TablesDataComponent } from './components/Others/pagination/tables-data/tables-data.component';
import { ChartsChartjsComponent } from './components/Others/pagination/charts-chartjs/charts-chartjs.component';
import { ChartsApexchartsComponent } from './components/Others/pagination/charts-apexcharts/charts-apexcharts.component';
import { IconsBootstrapComponent } from './components/Others/pagination/icons-bootstrap/icons-bootstrap.component';
import { IconsRemixComponent } from './components/Others/pagination/icons-remix/icons-remix.component';
import { IconsBoxiconsComponent } from './components/Others/pagination/icons-boxicons/icons-boxicons.component';
import { UsersProfileComponent } from './pages/users-profile/users-profile.component';
import { PagesFaqComponent } from './pages/pages-faq/pages-faq.component';
import { PagesContactComponent } from './pages/pages-contact/pages-contact.component';
import { PagesRegisterComponent } from './pages/pages-register/pages-register.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { PagesError404Component } from './pages/pages-error404/pages-error404.component';
import { PagesBlankComponent } from './pages/pages-blank/pages-blank.component';
import { ProductManagementComponent } from './components/Product/product-management/product-management.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { ProductOperationComponent } from './components/Product/product-operation/product-operation.component';
import { PaymentComponent } from './components/Others/pagination/payment/payment.component';
import { AlertifyService } from './services/ui/alertify.service';
import { NgxPopper } from 'angular-popper';
import { HomepageComponent } from './components/Homepage/homepage.component';
import { OrderOperationComponent } from './components/Order/order-operation/order-operation.component';
import { CategoryOperationComponent } from './components/Category/category-operation/category-operation.component';
import { OrderManagamentComponent } from './components/Order/order-managament/order-managament.component';
import { CategoryManagamentComponent } from './components/Category/category-managament/category-managament.component';
import { ShelvesManagamentComponent } from './components/Shelf/shelves-managament/shelves-managament.component';
import { ShelveOperationComponent } from './components/Shelf/shelve-operation/shelve-operation.component';
import { WarehouseOperationComponent } from './components/Warehouse/warehouse-operation/warehouse-operation.component';
import { OrderBillingOperationComponent } from './components/Order/order-billing-operation/order-billing-operation.component';
import { FilterShelvesPipe } from './pipes/filter-shelves.pipe';
import { CollectProductOfOrderComponent } from './components/Order/collect-product-of-order/collect-product-of-order.component';
import { WarehouseOperationListComponent } from './components/Warehouse/warehouse-operation/warehouse-operation-list/warehouse-operation-list.component';
import { WarehouseOperationConfirmDetailComponent } from './components/Warehouse/warehouse-operation/warehouse-operation-confirm-detail/warehouse-operation-confirm-detail.component';
import { HttpErrorInterceptor } from './services/ui/http-error-interceptor.service';
import { CollectedPackagesComponent } from './components/Order/collected-packages/collected-packages.component';
import { CollectedPackageDetailComponent } from './components/Order/collected-package-detail/collected-package-detail.component';
import { WarehosueShelfCountComponent } from './components/Warehouse/warehosue-shelf-count/warehosue-shelf-count.component';
import { SaleOrderManagamentComponent } from './components/Order/sale-order-managament/sale-order-managament.component';
import { PurchaseOrderManagamentComponent } from './components/Order/purchase-order-managament/purchase-order-managament.component';
import { CreatePurchaseOrderComponent } from './components/Order/create-purchase-order/create-purchase-order.component';
import { CreateSaleOrderComponent } from './components/Order/create-sale-order/create-sale-order.component';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { WarehouseShelfCountListComponent } from './components/Warehouse/warehouse-shelf-count-list/warehouse-shelf-count-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InvoiceListComponent } from './components/Order/invoice-list/invoice-list.component';
import { FastTransferComponent } from './components/Warehouse/fast-transfer/fast-transfer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateQrComponent } from './components/Order/create-qr/create-qr.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPrintModule } from 'ngx-print';
import { CommonModule, DatePipe } from '@angular/common';
import { WarehouseTransferListComponent } from './components/Warehouse/warehouse-transfer-list/warehouse-transfer-list.component';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { LogManagamentComponent } from './components/Log/log-managament/log-managament.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ShelfTransferRequestComponent } from './components/Warehouse/shelf-transfer-request/shelf-transfer-request.component';
import { DropdownModule } from 'primeng/dropdown';
import { SearchQrComponent } from './components/Product/search-qr/search-qr.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { BoxCountComponent } from './components/Warehouse/box-count/box-count.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CreateOrderComponent } from './components/Order/create-order/create-order.component';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ReferrerPolicyDirective } from './referrer-policy.directive';
import { TestComponent } from './components/Order/invoice-list/test/test.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PagesLoginv2Component } from './pages/pages-loginv2/pages-loginv2.component';
import { JwtModule } from '@auth0/angular-jwt';
import { UserListComponent } from './components/User/user-list/user-list.component';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { CustomerListComponent } from './components/Customer/customer-list/customer-list.component';
import { StepsModule } from 'primeng/steps';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';

import { ChartModule } from 'primeng/chart';
import { CargoDetailComponent } from './components/cargo/cargo-detail/cargo-detail.component';
import { CargoListComponent } from './components/cargo/cargo-list/cargo-list.component';
import { CreateCargoComponent } from './components/cargo/create-cargo/create-cargo.component';
import { AddCustomerComponent } from './components/Customer/add-customer/add-customer.component';
import { UnfinishedOrderComponent } from './components/Order/unfinished-order/unfinished-order.component';
import { CreateArasCargoBarcodeComponent } from './components/cargo/create-aras-cargo-barcode/create-aras-cargo-barcode.component';
import { DevolopmentListComponent } from './components/Devolopment/devolopment-list/devolopment-list.component';
import { FieldsetModule } from 'primeng/fieldset';
import { EditorModule } from 'primeng/editor';
import { ToolbarModule } from 'primeng/toolbar';
import { NebimStockControlComponent } from './components/Product/nebim-stock-control/nebim-stock-control.component';
import { NebimGetOrdersComponent } from './components/Order/nebim-get-orders/nebim-get-orders.component';
import { NebimProductExtractComponent } from './components/Product/nebim-product-extract/nebim-product-extract.component';
import { CreateBarcodeComponent } from './components/Product/create-barcode/create-barcode.component';

@NgModule({

  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    AlertsComponent,
    AccordionComponent,
    BadgesComponent,
    BreadcrumbsComponent,
    ButtonsComponent,
    CardsComponent,
    CarouselComponent,
    ListGroupComponent,
    ModalComponent,
    TabsComponent,
    PaginationComponent,
    ProgressComponent,
    SpinnersComponent,
    TooltipsComponent,
    FormsElementsComponent,
    FormsLayoutsComponent,
    FormsEditorsComponent,
    TablesGeneralComponent,
    TablesDataComponent,
    ChartsChartjsComponent,
    ChartsApexchartsComponent,
    IconsBootstrapComponent,
    IconsRemixComponent,
    IconsBoxiconsComponent,
    UsersProfileComponent,
    PagesFaqComponent,
    PagesContactComponent,
    PagesRegisterComponent,
    PagesLoginComponent,
    PagesError404Component,
    PagesBlankComponent,
    ProductManagementComponent,
    ProductOperationComponent,
    PaymentComponent,
    HomepageComponent,
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
    TestComponent,
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
    CreateBarcodeComponent],


  imports: [
    ToolbarModule,
    SkeletonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({ type: 'line-scale-pulse-out' }),
    ZXingScannerModule,
    NgxPaginationModule,
    NgSelectModule,
    QRCodeModule,
    NgxPrintModule,
    CommonModule,
    DialogModule,
    ImageModule,
    ToastModule,
    InputTextareaModule,
    DropdownModule,
    InputSwitchModule,
    BlockUIModule,
    RadioButtonModule,
    PanelModule,
    TabViewModule,
    CardModule,
    ButtonModule,
    StepsModule,
    ChartModule,
    SelectButtonModule,
    SidebarModule,
    FileUploadModule, TableModule, InputTextModule, MessagesModule, FieldsetModule, EditorModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('accessToken'),
        allowedDomains: ['localhost:7178', 'localhost:7180', '212.156.46.206:7180'],
      },
    }),

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService, DatePipe, AlertifyService, NgModule, NgxPopper, DatePipe, NgxSpinnerModule, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
