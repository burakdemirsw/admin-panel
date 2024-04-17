"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var forms_2 = require("@angular/forms");
var ngx_spinner_1 = require("ngx-spinner");
var animations_1 = require("@angular/platform-browser/animations");
var sidebar_1 = require("primeng/sidebar");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var header_component_1 = require("./layouts/header/header.component");
var footer_component_1 = require("./layouts/footer/footer.component");
var sidebar_component_1 = require("./layouts/sidebar/sidebar.component");
var dashboard_component_1 = require("./pages/dashboard/dashboard.component");
var alerts_component_1 = require("./components/Others/pagination/alerts/alerts.component");
var accordion_component_1 = require("./components/Others/pagination/accordion/accordion.component");
var badges_component_1 = require("./components/Others/pagination/badges/badges.component");
var breadcrumbs_component_1 = require("./components/Others/pagination/breadcrumbs/breadcrumbs.component");
var buttons_component_1 = require("./components/Others/pagination/buttons/buttons.component");
var cards_component_1 = require("./components/Others/pagination/cards/cards.component");
var carousel_component_1 = require("./components/Others/pagination/carousel/carousel.component");
var list_group_component_1 = require("./components/Others/pagination/list-group/list-group.component");
var modal_component_1 = require("./components/Others/pagination/modal/modal.component");
var tabs_component_1 = require("./components/Others/pagination/tabs/tabs.component");
var pagination_component_1 = require("./components/Others/pagination/pagination.component");
var progress_component_1 = require("./components/Others/pagination/progress/progress.component");
var spinners_component_1 = require("./components/Others/pagination/spinners/spinners.component");
var tooltips_component_1 = require("./components/Others/pagination/tooltips/tooltips.component");
var forms_elements_component_1 = require("./components/Others/pagination/forms-elements/forms-elements.component");
var forms_layouts_component_1 = require("./components/Others/pagination/forms-layouts/forms-layouts.component");
var forms_editors_component_1 = require("./components/Others/pagination/forms-editors/forms-editors.component");
var tables_general_component_1 = require("./components/Others/pagination/tables-general/tables-general.component");
var tables_data_component_1 = require("./components/Others/pagination/tables-data/tables-data.component");
var charts_chartjs_component_1 = require("./components/Others/pagination/charts-chartjs/charts-chartjs.component");
var charts_apexcharts_component_1 = require("./components/Others/pagination/charts-apexcharts/charts-apexcharts.component");
var icons_bootstrap_component_1 = require("./components/Others/pagination/icons-bootstrap/icons-bootstrap.component");
var icons_remix_component_1 = require("./components/Others/pagination/icons-remix/icons-remix.component");
var icons_boxicons_component_1 = require("./components/Others/pagination/icons-boxicons/icons-boxicons.component");
var users_profile_component_1 = require("./pages/users-profile/users-profile.component");
var pages_faq_component_1 = require("./pages/pages-faq/pages-faq.component");
var pages_contact_component_1 = require("./pages/pages-contact/pages-contact.component");
var pages_register_component_1 = require("./pages/pages-register/pages-register.component");
var pages_login_component_1 = require("./pages/pages-login/pages-login.component");
var pages_error404_component_1 = require("./pages/pages-error404/pages-error404.component");
var pages_blank_component_1 = require("./pages/pages-blank/pages-blank.component");
var product_management_component_1 = require("./components/Product/product-management/product-management.component");
var http_1 = require("@angular/common/http");
var product_operation_component_1 = require("./components/Product/product-operation/product-operation.component");
var payment_component_1 = require("./components/Others/pagination/payment/payment.component");
var alertify_service_1 = require("./services/ui/alertify.service");
var angular_popper_1 = require("angular-popper");
var homepage_component_1 = require("./components/Homepage/homepage.component");
var order_operation_component_1 = require("./components/Order/order-operation/order-operation.component");
var category_operation_component_1 = require("./components/Category/category-operation/category-operation.component");
var order_managament_component_1 = require("./components/Order/order-managament/order-managament.component");
var category_managament_component_1 = require("./components/Category/category-managament/category-managament.component");
var shelves_managament_component_1 = require("./components/Shelf/shelves-managament/shelves-managament.component");
var shelve_operation_component_1 = require("./components/Shelf/shelve-operation/shelve-operation.component");
var warehouse_operation_component_1 = require("./components/Warehouse/warehouse-operation/warehouse-operation.component");
var order_billing_operation_component_1 = require("./components/Order/order-billing-operation/order-billing-operation.component");
var filter_shelves_pipe_1 = require("./pipes/filter-shelves.pipe");
var collect_product_of_order_component_1 = require("./components/Order/collect-product-of-order/collect-product-of-order.component");
var warehouse_operation_list_component_1 = require("./components/Warehouse/warehouse-operation/warehouse-operation-list/warehouse-operation-list.component");
var warehouse_operation_confirm_detail_component_1 = require("./components/Warehouse/warehouse-operation/warehouse-operation-confirm-detail/warehouse-operation-confirm-detail.component");
var http_error_interceptor_service_1 = require("./services/ui/http-error-interceptor.service");
var collected_packages_component_1 = require("./components/Order/collected-packages/collected-packages.component");
var collected_package_detail_component_1 = require("./components/Order/collected-package-detail/collected-package-detail.component");
var warehosue_shelf_count_component_1 = require("./components/Warehouse/warehosue-shelf-count/warehosue-shelf-count.component");
var sale_order_managament_component_1 = require("./components/Order/sale-order-managament/sale-order-managament.component");
var purchase_order_managament_component_1 = require("./components/Order/purchase-order-managament/purchase-order-managament.component");
var create_purchase_order_component_1 = require("./components/Order/create-purchase-order/create-purchase-order.component");
var create_sale_order_component_1 = require("./components/Order/create-sale-order/create-sale-order.component");
var image_modal_component_1 = require("./image-modal/image-modal.component");
var ngx_scanner_1 = require("@zxing/ngx-scanner");
var warehouse_shelf_count_list_component_1 = require("./components/Warehouse/warehouse-shelf-count-list/warehouse-shelf-count-list.component");
var ngx_pagination_1 = require("ngx-pagination");
var invoice_list_component_1 = require("./components/Order/invoice-list/invoice-list.component");
var fast_transfer_component_1 = require("./components/Warehouse/fast-transfer/fast-transfer.component");
var ng_select_1 = require("@ng-select/ng-select");
var create_qr_component_1 = require("./components/Order/create-qr/create-qr.component");
var angularx_qrcode_1 = require("angularx-qrcode");
var ngx_print_1 = require("ngx-print");
var common_1 = require("@angular/common");
var warehouse_transfer_list_component_1 = require("./components/Warehouse/warehouse-transfer-list/warehouse-transfer-list.component");
var dialog_1 = require("primeng/dialog");
var image_1 = require("primeng/image");
var toast_1 = require("primeng/toast");
var log_managament_component_1 = require("./components/Log/log-managament/log-managament.component");
var inputtextarea_1 = require("primeng/inputtextarea");
var shelf_transfer_request_component_1 = require("./components/Warehouse/shelf-transfer-request/shelf-transfer-request.component");
var dropdown_1 = require("primeng/dropdown");
var search_qr_component_1 = require("./components/Product/search-qr/search-qr.component");
var inputswitch_1 = require("primeng/inputswitch");
var blockui_1 = require("primeng/blockui");
var panel_1 = require("primeng/panel");
var box_count_component_1 = require("./components/Warehouse/box-count/box-count.component");
var radiobutton_1 = require("primeng/radiobutton");
var create_order_component_1 = require("./components/Order/create-order/create-order.component");
var tabview_1 = require("primeng/tabview");
var card_1 = require("primeng/card");
var button_1 = require("primeng/button");
var fileupload_1 = require("primeng/fileupload");
var referrer_policy_directive_1 = require("./referrer-policy.directive");
var test_component_1 = require("./components/Order/invoice-list/test/test.component");
var table_1 = require("primeng/table");
var inputtext_1 = require("primeng/inputtext");
var pages_loginv2_component_1 = require("./pages/pages-loginv2/pages-loginv2.component");
var angular_jwt_1 = require("@auth0/angular-jwt");
var user_list_component_1 = require("./components/User/user-list/user-list.component");
var messages_1 = require("primeng/messages");
var api_1 = require("primeng/api");
var customer_list_component_1 = require("./components/Customer/customer-list/customer-list.component");
var steps_1 = require("primeng/steps");
var skeleton_1 = require("primeng/skeleton");
var selectbutton_1 = require("primeng/selectbutton");
var chart_1 = require("primeng/chart");
var cargo_detail_component_1 = require("./components/cargo/cargo-detail/cargo-detail.component");
var cargo_list_component_1 = require("./components/cargo/cargo-list/cargo-list.component");
var create_cargo_component_1 = require("./components/cargo/create-cargo/create-cargo.component");
var add_customer_component_1 = require("./components/Customer/add-customer/add-customer.component");
var unfinished_order_component_1 = require("./components/Order/unfinished-order/unfinished-order.component");
var create_aras_cargo_barcode_component_1 = require("./components/cargo/create-aras-cargo-barcode/create-aras-cargo-barcode.component");
var devolopment_list_component_1 = require("./components/Devolopment/devolopment-list/devolopment-list.component");
var fieldset_1 = require("primeng/fieldset");
var editor_1 = require("primeng/editor");
var toolbar_1 = require("primeng/toolbar");
var nebim_stock_control_component_1 = require("./components/Product/nebim-stock-control/nebim-stock-control.component");
var nebim_get_orders_component_1 = require("./components/Order/nebim-get-orders/nebim-get-orders.component");
var nebim_product_extract_component_1 = require("./components/Product/nebim-product-extract/nebim-product-extract.component");
var create_barcode_component_1 = require("./components/Product/create-barcode/create-barcode.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                header_component_1.HeaderComponent,
                footer_component_1.FooterComponent,
                sidebar_component_1.SidebarComponent,
                dashboard_component_1.DashboardComponent,
                alerts_component_1.AlertsComponent,
                accordion_component_1.AccordionComponent,
                badges_component_1.BadgesComponent,
                breadcrumbs_component_1.BreadcrumbsComponent,
                buttons_component_1.ButtonsComponent,
                cards_component_1.CardsComponent,
                carousel_component_1.CarouselComponent,
                list_group_component_1.ListGroupComponent,
                modal_component_1.ModalComponent,
                tabs_component_1.TabsComponent,
                pagination_component_1.PaginationComponent,
                progress_component_1.ProgressComponent,
                spinners_component_1.SpinnersComponent,
                tooltips_component_1.TooltipsComponent,
                forms_elements_component_1.FormsElementsComponent,
                forms_layouts_component_1.FormsLayoutsComponent,
                forms_editors_component_1.FormsEditorsComponent,
                tables_general_component_1.TablesGeneralComponent,
                tables_data_component_1.TablesDataComponent,
                charts_chartjs_component_1.ChartsChartjsComponent,
                charts_apexcharts_component_1.ChartsApexchartsComponent,
                icons_bootstrap_component_1.IconsBootstrapComponent,
                icons_remix_component_1.IconsRemixComponent,
                icons_boxicons_component_1.IconsBoxiconsComponent,
                users_profile_component_1.UsersProfileComponent,
                pages_faq_component_1.PagesFaqComponent,
                pages_contact_component_1.PagesContactComponent,
                pages_register_component_1.PagesRegisterComponent,
                pages_login_component_1.PagesLoginComponent,
                pages_error404_component_1.PagesError404Component,
                pages_blank_component_1.PagesBlankComponent,
                product_management_component_1.ProductManagementComponent,
                product_operation_component_1.ProductOperationComponent,
                payment_component_1.PaymentComponent,
                homepage_component_1.HomepageComponent,
                order_operation_component_1.OrderOperationComponent,
                category_operation_component_1.CategoryOperationComponent,
                order_managament_component_1.OrderManagamentComponent,
                category_managament_component_1.CategoryManagamentComponent,
                shelves_managament_component_1.ShelvesManagamentComponent,
                shelve_operation_component_1.ShelveOperationComponent,
                warehouse_operation_component_1.WarehouseOperationComponent,
                order_billing_operation_component_1.OrderBillingOperationComponent,
                filter_shelves_pipe_1.FilterShelvesPipe,
                collect_product_of_order_component_1.CollectProductOfOrderComponent,
                warehouse_operation_list_component_1.WarehouseOperationListComponent,
                warehouse_operation_confirm_detail_component_1.WarehouseOperationConfirmDetailComponent,
                collected_packages_component_1.CollectedPackagesComponent,
                collected_package_detail_component_1.CollectedPackageDetailComponent,
                warehosue_shelf_count_component_1.WarehosueShelfCountComponent,
                sale_order_managament_component_1.SaleOrderManagamentComponent,
                purchase_order_managament_component_1.PurchaseOrderManagamentComponent,
                create_purchase_order_component_1.CreatePurchaseOrderComponent,
                create_sale_order_component_1.CreateSaleOrderComponent,
                image_modal_component_1.ImageModalComponent,
                warehouse_shelf_count_list_component_1.WarehouseShelfCountListComponent,
                invoice_list_component_1.InvoiceListComponent,
                fast_transfer_component_1.FastTransferComponent,
                create_qr_component_1.CreateQrComponent,
                warehouse_transfer_list_component_1.WarehouseTransferListComponent,
                log_managament_component_1.LogManagamentComponent,
                shelf_transfer_request_component_1.ShelfTransferRequestComponent,
                search_qr_component_1.SearchQrComponent,
                box_count_component_1.BoxCountComponent,
                create_order_component_1.CreateOrderComponent,
                referrer_policy_directive_1.ReferrerPolicyDirective,
                test_component_1.TestComponent,
                pages_loginv2_component_1.PagesLoginv2Component,
                user_list_component_1.UserListComponent,
                customer_list_component_1.CustomerListComponent,
                create_cargo_component_1.CreateCargoComponent,
                cargo_list_component_1.CargoListComponent,
                cargo_detail_component_1.CargoDetailComponent,
                add_customer_component_1.AddCustomerComponent,
                unfinished_order_component_1.UnfinishedOrderComponent,
                create_aras_cargo_barcode_component_1.CreateArasCargoBarcodeComponent,
                devolopment_list_component_1.DevolopmentListComponent,
                nebim_stock_control_component_1.NebimStockControlComponent,
                nebim_get_orders_component_1.NebimGetOrdersComponent,
                nebim_product_extract_component_1.NebimProductExtractComponent,
                create_barcode_component_1.CreateBarcodeComponent,
            ],
            imports: [
                toolbar_1.ToolbarModule,
                skeleton_1.SkeletonModule,
                forms_1.FormsModule,
                forms_2.ReactiveFormsModule,
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                animations_1.BrowserAnimationsModule,
                ngx_spinner_1.NgxSpinnerModule.forRoot({ type: 'line-scale-pulse-out' }),
                ngx_scanner_1.ZXingScannerModule,
                ngx_pagination_1.NgxPaginationModule,
                ng_select_1.NgSelectModule,
                angularx_qrcode_1.QRCodeModule,
                ngx_print_1.NgxPrintModule,
                common_1.CommonModule,
                dialog_1.DialogModule,
                image_1.ImageModule,
                toast_1.ToastModule,
                inputtextarea_1.InputTextareaModule,
                dropdown_1.DropdownModule,
                inputswitch_1.InputSwitchModule,
                blockui_1.BlockUIModule,
                radiobutton_1.RadioButtonModule,
                panel_1.PanelModule,
                tabview_1.TabViewModule,
                card_1.CardModule,
                button_1.ButtonModule,
                steps_1.StepsModule,
                chart_1.ChartModule,
                selectbutton_1.SelectButtonModule,
                sidebar_1.SidebarModule,
                fileupload_1.FileUploadModule, table_1.TableModule, inputtext_1.InputTextModule, messages_1.MessagesModule, fieldset_1.FieldsetModule, editor_1.EditorModule,
                angular_jwt_1.JwtModule.forRoot({
                    config: {
                        tokenGetter: function () { return localStorage.getItem('accessToken'); },
                        allowedDomains: ['localhost:7178', 'localhost:7180', '212.156.46.206:7180']
                    }
                }),
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            providers: [api_1.MessageService, common_1.DatePipe, alertify_service_1.AlertifyService, core_1.NgModule, angular_popper_1.NgxPopper, common_1.DatePipe, ngx_spinner_1.NgxSpinnerModule, {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: http_error_interceptor_service_1.HttpErrorInterceptor,
                    multi: true
                }],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
