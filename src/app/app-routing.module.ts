import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AlertsComponent } from './components/Others/pagination/alerts/alerts.component';
import { AccordionComponent } from './components/Others/pagination/accordion/accordion.component';
import { BadgesComponent } from './components/Others/pagination/badges/badges.component';
import { BreadcrumbsComponent } from './components/Others/pagination/breadcrumbs/breadcrumbs.component';
import { ButtonsComponent } from './components/Others/pagination/buttons/buttons.component';
import { CardsComponent } from './components/Others/pagination/cards/cards.component';
import { CarouselComponent } from './components/Others/pagination/carousel/carousel.component';
import { ChartsApexchartsComponent } from './components/Others/pagination/charts-apexcharts/charts-apexcharts.component';
import { ChartsChartjsComponent } from './components/Others/pagination/charts-chartjs/charts-chartjs.component';
import { FormsEditorsComponent } from './components/Others/pagination/forms-editors/forms-editors.component';
import { FormsElementsComponent } from './components/Others/pagination/forms-elements/forms-elements.component';
import { FormsLayoutsComponent } from './components/Others/pagination/forms-layouts/forms-layouts.component';
import { IconsBootstrapComponent } from './components/Others/pagination/icons-bootstrap/icons-bootstrap.component';
import { IconsBoxiconsComponent } from './components/Others/pagination/icons-boxicons/icons-boxicons.component';
import { IconsRemixComponent } from './components/Others/pagination/icons-remix/icons-remix.component';
import { ListGroupComponent } from './components/Others/pagination/list-group/list-group.component';
import { ModalComponent } from './components/Others/pagination/modal/modal.component';
import { PaginationComponent } from './components/Others/pagination/pagination.component';
import { ProgressComponent } from './components/Others/pagination/progress/progress.component';
import { SpinnersComponent } from './components/Others/pagination/spinners/spinners.component';
import { TablesDataComponent } from './components/Others/pagination/tables-data/tables-data.component';
import { TablesGeneralComponent } from './components/Others/pagination/tables-general/tables-general.component';
import { TabsComponent } from './components/Others/pagination/tabs/tabs.component';
import { TooltipsComponent } from './components/Others/pagination/tooltips/tooltips.component';
import { PagesBlankComponent } from './pages/pages-blank/pages-blank.component';
import { PagesContactComponent } from './pages/pages-contact/pages-contact.component';
import { PagesError404Component } from './pages/pages-error404/pages-error404.component';
import { PagesFaqComponent } from './pages/pages-faq/pages-faq.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { PagesRegisterComponent } from './pages/pages-register/pages-register.component';
import { UsersProfileComponent } from './pages/users-profile/users-profile.component';
import { ProductManagementComponent } from './components/Product/product-management/product-management.component';
import { ProductOperationComponent } from './components/Product/product-operation/product-operation.component';
import { HomepageComponent } from './components/Homepage/homepage.component';
import { CategoryOperationComponent } from './components/Category/category-operation/category-operation.component';
import { OrderOperationComponent } from './components/Order/order-operation/order-operation.component';
import { OrderManagamentComponent } from './components/Order/order-managament/order-managament.component';
import { CategoryManagamentComponent } from './components/Category/category-managament/category-managament.component';
import { ShelvesManagamentComponent } from './components/Shelf/shelves-managament/shelves-managament.component';
import { ShelveOperationComponent } from './components/Shelf/shelve-operation/shelve-operation.component';
import { WarehouseOperationComponent } from './components/Warehouse/warehouse-operation/warehouse-operation.component';
import { OrderBillingOperationComponent } from './components/Order/order-billing-operation/order-billing-operation.component';
import { AuthGuard } from './components/auth.guard';
import { CollectProductOfOrderComponent } from './components/Order/collect-product-of-order/collect-product-of-order.component';
import { WarehouseOperationListComponent } from './components/Warehouse/warehouse-operation/warehouse-operation-list/warehouse-operation-list.component';
import { WarehosueOperationDetailModel } from './models/model/warehouse/warehosueOperationDetail';
import { WarehouseOperationConfirmDetailComponent } from './components/Warehouse/warehouse-operation/warehouse-operation-confirm-detail/warehouse-operation-confirm-detail.component';
import { CollectedPackagesComponent } from './components/Order/collected-packages/collected-packages.component';
import { CollectedPackageDetailComponent } from './components/Order/collected-package-detail/collected-package-detail.component';
import { WarehosueShelfCountComponent } from './components/Warehouse/warehosue-shelf-count/warehosue-shelf-count.component';
import { SaleOrderManagamentComponent } from './components/Order/sale-order-managament/sale-order-managament.component';
import { PurchaseOrderManagamentComponent } from './components/Order/purchase-order-managament/purchase-order-managament.component';
import { CreatePurchaseInvoice } from './models/model/invoice/createPurchaseInvoice';
import { CreatePurchaseOrderComponent } from './components/Order/create-purchase-order/create-purchase-order.component';
import { CreateSaleOrderComponent } from './components/Order/create-sale-order/create-sale-order.component';
import { WarehouseShelfCountListComponent } from './components/Warehouse/warehouse-shelf-count-list/warehouse-shelf-count-list.component';
import { InvoiceListComponent } from './components/Order/invoice-list/invoice-list.component';
import { FastTransferComponent } from './components/Warehouse/fast-transfer/fast-transfer.component';
import { CreateQrComponent } from './components/Order/create-qr/create-qr.component';
import { WarehouseTransferListComponent } from './components/Warehouse/warehouse-transfer-list/warehouse-transfer-list.component';
import { LogManagamentComponent } from './components/Log/log-managament/log-managament.component';
import { ShelfTransferRequestComponent } from './components/Warehouse/shelf-transfer-request/shelf-transfer-request.component';
import { SearchQrComponent } from './components/Product/search-qr/search-qr.component';
import { BoxCountComponent } from './components/Warehouse/box-count/box-count.component';
import { CreateOrderComponent } from './components/Order/create-order/create-order.component';
import { PagesLoginv2Component } from './pages/pages-loginv2/pages-loginv2.component';
import { UserListComponent } from './components/User/user-list/user-list.component';
import { CustomerList_VM } from './models/model/order/getCustomerList_CM';
import { CustomerListComponent } from './components/Customer/customer-list/customer-list.component';
import { CreateCargoComponent } from './components/cargo/create-cargo/create-cargo.component';
import { CargoListComponent } from './components/cargo/cargo-list/cargo-list.component';

const routes: Routes = [

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  {
    path: 'user-profile',
    component: UsersProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [AuthGuard],
  },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'pages-login', component: PagesLoginComponent },
  { path: 'pages-loginv2', component: PagesLoginv2Component },
  {
    path: 'product-managament',
    component: ProductManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product-operation',
    component: ProductOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-cargo',
    component: CreateCargoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-cargo/:orderNumber',
    component: CreateCargoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customer-list',
    component: CustomerListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home', component: HomepageComponent, canActivate: [AuthGuard] },
  {
    path: 'category-operation',
    component: CategoryOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categories-managament',
    component: CategoryManagamentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shelves-managament',
    component: ShelvesManagamentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shelf-operation/:id',
    component: ShelveOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shelf-operation',
    component: ShelveOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order-operation',
    component: OrderOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order-operation/:orderNumber',
    component: OrderOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order-operation/:orderNumber/:isInvoice',
    component: OrderOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orderBilling-operation',
    component: OrderBillingOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders-managament',
    component: OrderManagamentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cargo-list',
    component: CargoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-order/:id',
    component: CreateOrderComponent,
    canActivate: [AuthGuard],
  },


  {
    path: 'orders-managament/missing-list',
    component: OrderManagamentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sale-orders-managament',
    component: SaleOrderManagamentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'purchase-orders-managament',
    component: PurchaseOrderManagamentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-purchase-order/:orderNo',
    component: CreatePurchaseOrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-sale-order/:orderNo',
    component: CreateSaleOrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'collect-product-of-order/:number',
    component: CollectProductOfOrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'warehouse-operation/:number',
    component: WarehouseOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'warehouse-operation-list',
    component: WarehouseOperationListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'warehouse-operation-confirm-detail',
    component: WarehouseOperationConfirmDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'warehouse-operation-confirm-detail/:innerNumber',
    component: WarehouseOperationConfirmDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'collected-packages',
    component: CollectedPackagesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'collected-package-detail/:id',
    component: CollectedPackageDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'warehouse-shelf-count/:orderNo',
    component: WarehosueShelfCountComponent,
    canActivate: [AuthGuard],
  },
  { path: 'register', component: PagesRegisterComponent },
  { path: 'user-update/:userId', component: PagesRegisterComponent },
  {
    path: 'warehouse-shelf-count-list',
    component: WarehouseShelfCountListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoice-list',
    component: InvoiceListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fast-transfer',
    component: FastTransferComponent,
    canActivate: [AuthGuard],
  },
  { path: 'create-qr', component: CreateQrComponent, canActivate: [AuthGuard] },
  {
    path: 'warehouse-transfer-list',
    component: WarehouseTransferListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'log-managament',
    component: LogManagamentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shelf-transfer-request',
    component: ShelfTransferRequestComponent,
    canActivate: [AuthGuard],
  },
  { path: 'box-count', component: BoxCountComponent, canActivate: [AuthGuard] },
  { path: 'search-qr/:id', component: SearchQrComponent },
  { path: 'search-qr', component: SearchQrComponent },
  { path: '**', component: PagesError404Component },

  // {path:  'warehouse-managament', component: WarehouseManagamentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
