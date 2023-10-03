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

const routes: Routes = [
  // { path: 'alerts', component: AlertsComponent },
  // { path: 'accordion', component: AccordionComponent },
  // { path: 'badges', component: BadgesComponent },
  // { path: 'breadcrumbs', component: BreadcrumbsComponent },
  // { path: 'buttons', component: ButtonsComponent },
  // { path: 'cards', component: CardsComponent },
  // { path: 'carousel', component: CarouselComponent },
  // { path: 'charts-apexcharts', component: ChartsApexchartsComponent },
  // { path: 'charts-chartjs', component: ChartsChartjsComponent },
  // { path: 'form-editors', component: FormsEditorsComponent },
  // { path: 'form-elements', component: FormsElementsComponent },
  // { path: 'form-layouts', component: FormsLayoutsComponent },
  // { path: 'icons-bootstrap', component: IconsBootstrapComponent },
  // { path: 'icons-boxicons', component: IconsBoxiconsComponent },
  // { path: 'icons-remix', component: IconsRemixComponent },
  // { path: 'list-group', component: ListGroupComponent },
  // { path: 'modal', component: ModalComponent },
  // { path: 'pagination', component: PaginationComponent },
  // { path: 'progress', component: ProgressComponent },
  // { path: 'spinners', component: SpinnersComponent },
  // { path: 'tables-data', component: TablesDataComponent },
  // { path: 'tables-general', component: TablesGeneralComponent },
  // { path: 'tabs', component: TabsComponent },
  // { path: 'tooltips', component: TooltipsComponent },
  // { path: 'pages-blank', component: PagesBlankComponent },
  // { path: 'pages-contact', component: PagesContactComponent },
  { path: '', redirectTo: '/dashboard' ,pathMatch :"full" } ,




  // { path: 'pages-faq', component: PagesFaqComponent }, 
  // { path: 'pages-register', component: PagesRegisterComponent },
  { path: 'user-profile', component: UsersProfileComponent,canActivate:[AuthGuard] },
  { path: '', component: DashboardComponent,canActivate:[AuthGuard] },
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard] },
  { path: 'pages-login', component: PagesLoginComponent },
  { path: 'product', component: ProductManagementComponent ,canActivate:[AuthGuard]},
  { path: 'operation', component: ProductOperationComponent ,canActivate:[AuthGuard]},
  { path: 'home', component: HomepageComponent ,canActivate:[AuthGuard]}, 
  { path: 'category-operation', component: CategoryOperationComponent,canActivate:[AuthGuard] },
  { path: 'categories-managament', component: CategoryManagamentComponent,canActivate:[AuthGuard] },
  { path: 'shelves-managament', component: ShelvesManagamentComponent ,canActivate:[AuthGuard]},
  { path: 'shelf-operation/:id', component: ShelveOperationComponent ,canActivate:[AuthGuard]},
  { path: 'shelf-operation', component: ShelveOperationComponent ,canActivate:[AuthGuard]},
  { path: 'order-operation', component: OrderOperationComponent,canActivate:[AuthGuard] },
  { path: 'order-operation/:orderNumber', component: OrderOperationComponent,canActivate:[AuthGuard] },
  { path: 'orderBilling-operation', component: OrderBillingOperationComponent,canActivate:[AuthGuard] },
  { path: 'orders-managament', component: OrderManagamentComponent ,canActivate:[AuthGuard]},
  { path: 'sale-orders-managament', component: SaleOrderManagamentComponent ,canActivate:[AuthGuard]},
  { path: 'purchase-orders-managament', component:PurchaseOrderManagamentComponent ,canActivate:[AuthGuard]},
  { path: 'create-purchase-order/:orderNo', component:CreatePurchaseOrderComponent ,canActivate:[AuthGuard]},
  { path: 'create-sale-order/:orderNo', component:CreateSaleOrderComponent ,canActivate:[AuthGuard]},

  { path: 'collect-product-of-order/:number', component: CollectProductOfOrderComponent,canActivate:[AuthGuard] },
  { path: 'warehouse-operation', component: WarehouseOperationComponent,canActivate:[AuthGuard] },
  { path: 'warehouse-operation-confirm', component: WarehouseOperationListComponent ,canActivate:[AuthGuard]},
  { path: 'warehouse-operation-confirm-detail', component: WarehouseOperationConfirmDetailComponent ,canActivate:[AuthGuard]},
  { path: 'warehouse-operation-confirm-detail/:innerNumber', component: WarehouseOperationConfirmDetailComponent ,canActivate:[AuthGuard]},
  { path: 'collected-packages', component: CollectedPackagesComponent ,canActivate:[AuthGuard]},
  { path: 'collected-package-detail/:id', component: CollectedPackageDetailComponent ,canActivate:[AuthGuard]},
  { path: 'warehouse-shelf-count/:orderNo', component: WarehosueShelfCountComponent ,canActivate:[AuthGuard]},
  { path: 'register', component: PagesRegisterComponent},
  { path: 'warehouse-shelf-count-list', component: WarehouseShelfCountListComponent},
  { path: 'invoice-list', component: InvoiceListComponent},

  { path: '**', component: PagesError404Component }




  // {path:  'warehouse-managament', component: WarehouseManagamentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
