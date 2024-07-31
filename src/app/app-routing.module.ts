import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryManagamentComponent } from './components/Category/category-managament/category-managament.component';
import { CategoryOperationComponent } from './components/Category/category-operation/category-operation.component';
import { AddCustomerComponent } from './components/Customer/add-customer/add-customer.component';
import { CustomerListComponent } from './components/Customer/customer-list/customer-list.component';
import { DevolopmentListComponent } from './components/Devolopment/devolopment-list/devolopment-list.component';
import { HomepageComponent } from './components/Homepage/homepage.component';
import { LogManagamentComponent } from './components/Log/log-managament/log-managament.component';
import { CollectProductOfOrderComponent } from './components2/order/collect-product-of-order/collect-product-of-order.component';
import { CollectedPackageDetailComponent } from './components/Order/collected-package-detail/collected-package-detail.component';
import { CollectedPackagesComponent } from './components/Order/collected-packages/collected-packages.component';
import { CreateOrderComponent } from './components/Order/create-order/create-order.component';
import { CreatePurchaseOrderComponent } from './components/Order/create-purchase-order/create-purchase-order.component';
import { CreateQrComponent } from './components/Order/create-qr/create-qr.component';
import { CreateSaleOrderComponent } from './components/Order/create-sale-order/create-sale-order.component';
import { InvoiceListComponent } from './components/Order/invoice-list/invoice-list.component';
import { NebimGetOrdersComponent } from './components/Order/nebim-get-orders/nebim-get-orders.component';
import { OrderBillingOperationComponent } from './components/Order/order-billing-operation/order-billing-operation.component';
import { OrderManagamentComponent } from './components/Order/order-managament/order-managament.component';
import { OrderOperationComponent } from './components/Order/order-operation/order-operation.component';
import { PurchaseOrderManagamentComponent } from './components/Order/purchase-order-managament/purchase-order-managament.component';
import { SaleOrderManagamentComponent } from './components/Order/sale-order-managament/sale-order-managament.component';
import { UnfinishedOrderComponent } from './components/Order/unfinished-order/unfinished-order.component';
import { NebimProductExtractComponent } from './components/Product/nebim-product-extract/nebim-product-extract.component';
import { NebimStockControlComponent } from './components/Product/nebim-stock-control/nebim-stock-control.component';
import { ProductManagementComponent } from './components/Product/product-management/product-management.component';
import { ProductOperationComponent } from './components/Product/product-operation/product-operation.component';
import { SearchQrComponent } from './components/Product/search-qr/search-qr.component';
import { ShelveOperationComponent } from './components/Shelf/shelve-operation/shelve-operation.component';
import { ShelvesManagamentComponent } from './components/Shelf/shelves-managament/shelves-managament.component';
import { UserListComponent } from './components/User/user-list/user-list.component';
import { BoxCountComponent } from './components/Warehouse/box-count/box-count.component';
import { FastTransferComponent } from './components/Warehouse/fast-transfer/fast-transfer.component';
import { ShelfTransferRequestComponent } from './components/Warehouse/shelf-transfer-request/shelf-transfer-request.component';
import { WarehosueShelfCountComponent } from './components/Warehouse/warehosue-shelf-count/warehosue-shelf-count.component';
import { WarehouseOperationConfirmDetailComponent } from './components/Warehouse/warehouse-operation/warehouse-operation-confirm-detail/warehouse-operation-confirm-detail.component';
import { WarehouseOperationListComponent } from './components/Warehouse/warehouse-operation/warehouse-operation-list/warehouse-operation-list.component';
import { WarehouseOperationComponent } from './components/Warehouse/warehouse-operation/warehouse-operation.component';
import { WarehouseShelfCountListComponent } from './components/Warehouse/warehouse-shelf-count-list/warehouse-shelf-count-list.component';
import { WarehouseTransferListComponent } from './components/Warehouse/warehouse-transfer-list/warehouse-transfer-list.component';
import { AuthGuard } from './components/auth.guard';
import { CargoListComponent } from './components/cargo/cargo-list/cargo-list.component';
import { CreateArasCargoBarcodeComponent } from './components/cargo/create-aras-cargo-barcode/create-aras-cargo-barcode.component';
import { CreateCargoComponent } from './components/cargo/create-cargo/create-cargo.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PagesError404Component } from './pages/pages-error404/pages-error404.component';
import { PagesLoginv2Component } from './pages/pages-loginv2/pages-loginv2.component';
import { PagesRegisterComponent } from './pages/pages-register/pages-register.component';
import { UsersProfileComponent } from './pages/users-profile/users-profile.component';
import { CreateBarcodeComponent } from './components/Product/create-barcode/create-barcode.component';
import { FastTransferListComponent } from './components/Warehouse/fast-transfer/fast-transfer-list/fast-transfer-list.component';
import { RetailInvoiceListComponent } from './components2/invoice/retail-invoice-list/retail-invoice-list.component';
import { RetailOrderManagementComponent } from './components2/order/retail-order-management/retail-order-management.component';
import { CollectedPackagesComponent as CollectedPackagesComponent2 } from './components2/order/collected-packages/collected-packages.component';
import { OrderStateComponent } from './components/Order/order-state/order-state.component';
import { CreateProductBarcodeComponent } from './components/Product/create-product-barcode/create-product-barcode.component';
import { CreateProposalComponent } from './components/Product/create-proposal/create-proposal.component';
import { ProposalListComponent } from './components/Product/proposal-list/proposal-list.component';
import { ShelfComponent } from './components/Warehouse/shelf/shelf.component';
import { ServiceManagementComponent } from './components/service-management/service-management.component';


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
  { path: 'pages-login', component: PagesLoginv2Component },
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
    path: 'order-operation/:orderNumber/:isInvoice/:warehouseCode',
    component: OrderOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orderBilling-operation',
    component: OrderBillingOperationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders-managament/:status/:invoiceStatus',
    component: OrderManagamentComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'unfinished-orders',
    component: UnfinishedOrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cargo-list',
    component: CargoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-customer',
    component: AddCustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-order/:orderType/:id',
    component: CreateOrderComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'create-aras-cargo-barcode',
    component: CreateArasCargoBarcodeComponent,
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
    path: 'fast-transfer-list/:type',
    component: FastTransferListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'warehouse-operation/:number/:type',
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
    path: 'warehouse-shelf-count/:type/:orderNo',
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
    path: 'fast-transfer/:operationNo',
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
    path: 'shelf-transfer-request/:operationNo/:type',
    component: ShelfTransferRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shelf-transfer-request/:operationNo/:type/:shelfNo',
    component: ShelfTransferRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'devolopment-list',
    component: DevolopmentListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'order-state', component: OrderStateComponent },
  { path: 'box-count', component: BoxCountComponent, canActivate: [AuthGuard] },
  { path: 'search-qr/:id', component: SearchQrComponent },
  { path: 'search-qr', component: SearchQrComponent },
  { path: 'nebim-get-orders', component: NebimGetOrdersComponent },
  { path: 'nebim-stock-control', component: NebimStockControlComponent },
  { path: 'nebim-product-extract', component: NebimProductExtractComponent },
  { path: 'create-barcode/:operationNo', component: CreateBarcodeComponent },
  { path: 'create-product-barcode/:operationNo', component: CreateProductBarcodeComponent },
  { path: 'create-proposal/:id', component: CreateProposalComponent, canActivate: [AuthGuard] },
  { path: 'proposal-list', component: ProposalListComponent, canActivate: [AuthGuard] },
  { path: 'shelf', component: ShelfComponent, canActivate: [AuthGuard] },
  { path: 'service-management', component: ServiceManagementComponent, canActivate: [AuthGuard] },


  //-------------------------------------------------------------------------
  { path: 'retail-invoice-list', component: RetailInvoiceListComponent },
  { path: 'retail-orders-managament/:status/:invoiceStatus', component: RetailOrderManagementComponent },
  { path: 'retail-orders-collected-packages', component: CollectedPackagesComponent2 },
  //-------------------------------------------------------------------------
  { path: '**', component: PagesError404Component },


  // {path:  'warehouse-managament', component: WarehouseManagamentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
