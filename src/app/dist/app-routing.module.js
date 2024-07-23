"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var category_managament_component_1 = require("./components/Category/category-managament/category-managament.component");
var category_operation_component_1 = require("./components/Category/category-operation/category-operation.component");
var add_customer_component_1 = require("./components/Customer/add-customer/add-customer.component");
var customer_list_component_1 = require("./components/Customer/customer-list/customer-list.component");
var devolopment_list_component_1 = require("./components/Devolopment/devolopment-list/devolopment-list.component");
var homepage_component_1 = require("./components/Homepage/homepage.component");
var log_managament_component_1 = require("./components/Log/log-managament/log-managament.component");
var collect_product_of_order_component_1 = require("./components2/order/collect-product-of-order/collect-product-of-order.component");
var collected_package_detail_component_1 = require("./components/Order/collected-package-detail/collected-package-detail.component");
var collected_packages_component_1 = require("./components/Order/collected-packages/collected-packages.component");
var create_order_component_1 = require("./components/Order/create-order/create-order.component");
var create_purchase_order_component_1 = require("./components/Order/create-purchase-order/create-purchase-order.component");
var create_qr_component_1 = require("./components/Order/create-qr/create-qr.component");
var create_sale_order_component_1 = require("./components/Order/create-sale-order/create-sale-order.component");
var invoice_list_component_1 = require("./components/Order/invoice-list/invoice-list.component");
var nebim_get_orders_component_1 = require("./components/Order/nebim-get-orders/nebim-get-orders.component");
var order_billing_operation_component_1 = require("./components/Order/order-billing-operation/order-billing-operation.component");
var order_managament_component_1 = require("./components/Order/order-managament/order-managament.component");
var order_operation_component_1 = require("./components/Order/order-operation/order-operation.component");
var purchase_order_managament_component_1 = require("./components/Order/purchase-order-managament/purchase-order-managament.component");
var sale_order_managament_component_1 = require("./components/Order/sale-order-managament/sale-order-managament.component");
var unfinished_order_component_1 = require("./components/Order/unfinished-order/unfinished-order.component");
var nebim_product_extract_component_1 = require("./components/Product/nebim-product-extract/nebim-product-extract.component");
var nebim_stock_control_component_1 = require("./components/Product/nebim-stock-control/nebim-stock-control.component");
var product_management_component_1 = require("./components/Product/product-management/product-management.component");
var product_operation_component_1 = require("./components/Product/product-operation/product-operation.component");
var search_qr_component_1 = require("./components/Product/search-qr/search-qr.component");
var shelve_operation_component_1 = require("./components/Shelf/shelve-operation/shelve-operation.component");
var shelves_managament_component_1 = require("./components/Shelf/shelves-managament/shelves-managament.component");
var user_list_component_1 = require("./components/User/user-list/user-list.component");
var box_count_component_1 = require("./components/Warehouse/box-count/box-count.component");
var fast_transfer_component_1 = require("./components/Warehouse/fast-transfer/fast-transfer.component");
var shelf_transfer_request_component_1 = require("./components/Warehouse/shelf-transfer-request/shelf-transfer-request.component");
var warehosue_shelf_count_component_1 = require("./components/Warehouse/warehosue-shelf-count/warehosue-shelf-count.component");
var warehouse_operation_confirm_detail_component_1 = require("./components/Warehouse/warehouse-operation/warehouse-operation-confirm-detail/warehouse-operation-confirm-detail.component");
var warehouse_operation_list_component_1 = require("./components/Warehouse/warehouse-operation/warehouse-operation-list/warehouse-operation-list.component");
var warehouse_operation_component_1 = require("./components/Warehouse/warehouse-operation/warehouse-operation.component");
var warehouse_shelf_count_list_component_1 = require("./components/Warehouse/warehouse-shelf-count-list/warehouse-shelf-count-list.component");
var warehouse_transfer_list_component_1 = require("./components/Warehouse/warehouse-transfer-list/warehouse-transfer-list.component");
var auth_guard_1 = require("./components/auth.guard");
var cargo_list_component_1 = require("./components/cargo/cargo-list/cargo-list.component");
var create_aras_cargo_barcode_component_1 = require("./components/cargo/create-aras-cargo-barcode/create-aras-cargo-barcode.component");
var create_cargo_component_1 = require("./components/cargo/create-cargo/create-cargo.component");
var dashboard_component_1 = require("./pages/dashboard/dashboard.component");
var pages_error404_component_1 = require("./pages/pages-error404/pages-error404.component");
var pages_loginv2_component_1 = require("./pages/pages-loginv2/pages-loginv2.component");
var pages_register_component_1 = require("./pages/pages-register/pages-register.component");
var users_profile_component_1 = require("./pages/users-profile/users-profile.component");
var create_barcode_component_1 = require("./components/Product/create-barcode/create-barcode.component");
var fast_transfer_list_component_1 = require("./components/Warehouse/fast-transfer/fast-transfer-list/fast-transfer-list.component");
var retail_invoice_list_component_1 = require("./components2/invoice/retail-invoice-list/retail-invoice-list.component");
var retail_order_management_component_1 = require("./components2/order/retail-order-management/retail-order-management.component");
var collected_packages_component_2 = require("./components2/order/collected-packages/collected-packages.component");
var order_state_component_1 = require("./components/Order/order-state/order-state.component");
var create_product_barcode_component_1 = require("./components/Product/create-product-barcode/create-product-barcode.component");
var create_proposal_component_1 = require("./components/Product/create-proposal/create-proposal.component");
var proposal_list_component_1 = require("./components/Product/proposal-list/proposal-list.component");
var routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'user-profile',
        component: users_profile_component_1.UsersProfileComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'user-list',
        component: user_list_component_1.UserListComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    { path: '', component: dashboard_component_1.DashboardComponent, canActivate: [auth_guard_1.AuthGuard] },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    { path: 'pages-login', component: pages_loginv2_component_1.PagesLoginv2Component },
    { path: 'pages-loginv2', component: pages_loginv2_component_1.PagesLoginv2Component },
    {
        path: 'product-managament',
        component: product_management_component_1.ProductManagementComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'product-operation',
        component: product_operation_component_1.ProductOperationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'create-cargo',
        component: create_cargo_component_1.CreateCargoComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'create-cargo/:orderNumber',
        component: create_cargo_component_1.CreateCargoComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'customer-list',
        component: customer_list_component_1.CustomerListComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    { path: 'home', component: homepage_component_1.HomepageComponent, canActivate: [auth_guard_1.AuthGuard] },
    {
        path: 'category-operation',
        component: category_operation_component_1.CategoryOperationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'categories-managament',
        component: category_managament_component_1.CategoryManagamentComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'shelves-managament',
        component: shelves_managament_component_1.ShelvesManagamentComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'shelf-operation/:id',
        component: shelve_operation_component_1.ShelveOperationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'shelf-operation',
        component: shelve_operation_component_1.ShelveOperationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'order-operation',
        component: order_operation_component_1.OrderOperationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'order-operation/:orderNumber',
        component: order_operation_component_1.OrderOperationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'order-operation/:orderNumber/:isInvoice/:warehouseCode',
        component: order_operation_component_1.OrderOperationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'orderBilling-operation',
        component: order_billing_operation_component_1.OrderBillingOperationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'orders-managament/:status/:invoiceStatus',
        component: order_managament_component_1.OrderManagamentComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'unfinished-orders',
        component: unfinished_order_component_1.UnfinishedOrderComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'cargo-list',
        component: cargo_list_component_1.CargoListComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'add-customer',
        component: add_customer_component_1.AddCustomerComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'create-order/:orderType/:id',
        component: create_order_component_1.CreateOrderComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'create-aras-cargo-barcode',
        component: create_aras_cargo_barcode_component_1.CreateArasCargoBarcodeComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'orders-managament/missing-list',
        component: order_managament_component_1.OrderManagamentComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'sale-orders-managament',
        component: sale_order_managament_component_1.SaleOrderManagamentComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'purchase-orders-managament',
        component: purchase_order_managament_component_1.PurchaseOrderManagamentComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'create-purchase-order/:orderNo',
        component: create_purchase_order_component_1.CreatePurchaseOrderComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'create-sale-order/:orderNo',
        component: create_sale_order_component_1.CreateSaleOrderComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'collect-product-of-order/:number',
        component: collect_product_of_order_component_1.CollectProductOfOrderComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'fast-transfer-list/:type',
        component: fast_transfer_list_component_1.FastTransferListComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'warehouse-operation/:number/:type',
        component: warehouse_operation_component_1.WarehouseOperationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'warehouse-operation-list',
        component: warehouse_operation_list_component_1.WarehouseOperationListComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'warehouse-operation-confirm-detail',
        component: warehouse_operation_confirm_detail_component_1.WarehouseOperationConfirmDetailComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'warehouse-operation-confirm-detail/:innerNumber',
        component: warehouse_operation_confirm_detail_component_1.WarehouseOperationConfirmDetailComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'collected-packages',
        component: collected_packages_component_1.CollectedPackagesComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'collected-package-detail/:id',
        component: collected_package_detail_component_1.CollectedPackageDetailComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'warehouse-shelf-count/:type/:orderNo',
        component: warehosue_shelf_count_component_1.WarehosueShelfCountComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    { path: 'register', component: pages_register_component_1.PagesRegisterComponent },
    { path: 'user-update/:userId', component: pages_register_component_1.PagesRegisterComponent },
    {
        path: 'warehouse-shelf-count-list',
        component: warehouse_shelf_count_list_component_1.WarehouseShelfCountListComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'invoice-list',
        component: invoice_list_component_1.InvoiceListComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'fast-transfer/:operationNo',
        component: fast_transfer_component_1.FastTransferComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    { path: 'create-qr', component: create_qr_component_1.CreateQrComponent, canActivate: [auth_guard_1.AuthGuard] },
    {
        path: 'warehouse-transfer-list',
        component: warehouse_transfer_list_component_1.WarehouseTransferListComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'log-managament',
        component: log_managament_component_1.LogManagamentComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'shelf-transfer-request/:operationNo/:type',
        component: shelf_transfer_request_component_1.ShelfTransferRequestComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'devolopment-list',
        component: devolopment_list_component_1.DevolopmentListComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    { path: 'order-state', component: order_state_component_1.OrderStateComponent },
    { path: 'box-count', component: box_count_component_1.BoxCountComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'search-qr/:id', component: search_qr_component_1.SearchQrComponent },
    { path: 'search-qr', component: search_qr_component_1.SearchQrComponent },
    { path: 'nebim-get-orders', component: nebim_get_orders_component_1.NebimGetOrdersComponent },
    { path: 'nebim-stock-control', component: nebim_stock_control_component_1.NebimStockControlComponent },
    { path: 'nebim-product-extract', component: nebim_product_extract_component_1.NebimProductExtractComponent },
    { path: 'create-barcode/:operationNo', component: create_barcode_component_1.CreateBarcodeComponent },
    { path: 'create-product-barcode/:operationNo', component: create_product_barcode_component_1.CreateProductBarcodeComponent },
    { path: 'create-proposal/:id', component: create_proposal_component_1.CreateProposalComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'proposal-list', component: proposal_list_component_1.ProposalListComponent, canActivate: [auth_guard_1.AuthGuard] },
    //-------------------------------------------------------------------------
    { path: 'retail-invoice-list', component: retail_invoice_list_component_1.RetailInvoiceListComponent },
    { path: 'retail-orders-managament/:status/:invoiceStatus', component: retail_order_management_component_1.RetailOrderManagementComponent },
    { path: 'retail-orders-collected-packages', component: collected_packages_component_2.CollectedPackagesComponent },
    //-------------------------------------------------------------------------
    { path: '**', component: pages_error404_component_1.PagesError404Component },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
