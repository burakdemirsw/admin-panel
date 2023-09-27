import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { HttpClientModule,HTTP_INTERCEPTORS  } from '@angular/common/http';


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
    CreateSaleOrderComponent
  ],


  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({ type: 'line-scale-pulse-out' }),
    ReactiveFormsModule
  ],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AlertifyService, NgModule, NgxPopper, NgxSpinnerModule,{      provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {}