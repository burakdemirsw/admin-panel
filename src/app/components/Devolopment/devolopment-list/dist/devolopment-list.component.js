"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.DevolopmentListComponent = void 0;
var core_1 = require("@angular/core");
var development_1 = require("src/app/models/model/development/development");
var DevolopmentListComponent = /** @class */ (function () {
    function DevolopmentListComponent(formBuilder, toasterService, developmentService) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.developmentService = developmentService;
        this.tasks = [];
        this.devolopments = [];
        this.visible = false;
        this.visible2 = false;
        this.addZoneVisible = false;
        this.addTaskVisible = false;
        this.zone = "";
        this.updateTask_Header = "";
        this.selectedTask = new development_1.DevelopmentTask_VM();
        this.currentPage = 0;
        this.isCompleted = false;
        this.developmentId = 0;
        this.optionList = [{ value: true, label: "Tamamlananlar" }, { value: false, label: "Tamamlanmayanlar" }];
        this.addTask_Zone = 0;
        this.addTask_Description = "";
        this.addTask_Header = "";
    }
    DevolopmentListComponent.prototype.ngOnInit = function () {
        this.createSearchTaskForm();
        this.getAllZones();
        this.getAllDevelopments(this.searchTaskForm.value.searchTask_IsCompleted, this.searchTaskForm.value.searchTask_DevelopmentId);
        ;
    };
    DevolopmentListComponent.prototype.getDevelopmentRaport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.developmentService.getDevelopmentRaport()];
                    case 1:
                        _a.raport = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DevolopmentListComponent.prototype.createSearchTaskForm = function () {
        this.searchTaskForm = this.formBuilder.group({
            searchTask_IsCompleted: [false],
            searchTask_DevelopmentId: [0]
        });
    };
    DevolopmentListComponent.prototype.getAllDevelopments = function (isCompleted, developmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (isCompleted == 'true') {
                            isCompleted = true;
                        }
                        else {
                            isCompleted = false;
                        }
                        request = new development_1.Development_RM();
                        request.isCompleted = isCompleted;
                        this.searchTaskForm.get('searchTask_IsCompleted').setValue(isCompleted);
                        request.developmentId = Number(developmentId);
                        this.searchTaskForm.get('searchTask_DevelopmentId').setValue(developmentId);
                        return [4 /*yield*/, this.developmentService.getAllDevelopmentTasks(request).then(function (response) {
                                if (response.length == 0 || !response) {
                                    _this.toasterService.error("Görev Bulunamadı");
                                }
                                else {
                                    _this.tasks = response;
                                }
                            })];
                    case 1:
                        _a.sent();
                        this.getDevelopmentRaport();
                        return [2 /*return*/];
                }
            });
        });
    };
    DevolopmentListComponent.prototype.openModal = function (task) {
        this.selectedTask = task;
        this.description = task.description;
        this.updateTask_Header = task.header;
        this.visible = true;
    };
    DevolopmentListComponent.prototype.updateTaskDescription = function () {
        var _this = this;
        var request = new development_1.DevelopmentTask(this.description, this.selectedTask.isCompleted, this.selectedTask.finishedDate, this.selectedTask.id, this.selectedTask.createdDate, new Date(), this.updateTask_Header.toUpperCase(), this.selectedTask.developmentId);
        this.developmentService.updateDevelopmentTask(request).then(function (response) {
            _this.getAllDevelopments(_this.searchTaskForm.get('searchTask_IsCompleted').value, _this.searchTaskForm.get('searchTask_DevelopmentId').value);
            _this.visible = false;
            _this.description = "";
            _this.updateTask_Header = "";
            _this.toasterService.success("Görev Başarıyla Güncellendi");
        });
    };
    DevolopmentListComponent.prototype.updateTaskStatus = function (task, status) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!window.confirm("Görevi güncellemek istediğinize emin misiniz?")) return [3 /*break*/, 2];
                        request = new development_1.DevelopmentTask(task.description, status, task.finishedDate, task.id, task.createdDate, new Date(), task.header, task.developmentId);
                        return [4 /*yield*/, this.developmentService.updateDevelopmentTask(request).then(function (response) {
                                _this.getAllDevelopments(_this.searchTaskForm.get('searchTask_IsCompleted').value, _this.searchTaskForm.get('searchTask_DevelopmentId').value);
                                _this.toasterService.success("Görev Başarıyla Güncellendi");
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DevolopmentListComponent.prototype.deleteTask = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!window.confirm("Silmek istediğinize emin misiniz?")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.developmentService.deleteDevelopmentTask(task.id).then(function (response) {
                                _this.getAllDevelopments(_this.searchTaskForm.value.searchTask_IsCompleted, _this.searchTaskForm.value.searchTask_DevelopmentId);
                                ;
                                _this.toasterService.success("Görev Başarıyla Silindi");
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DevolopmentListComponent.prototype.addZone = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.developmentService.addDevelopment(new development_1.Development(this.zone)).then(function (response) {
                            _this.getAllDevelopments(_this.searchTaskForm.value.searchTask_IsCompleted, _this.searchTaskForm.value.searchTask_DevelopmentId);
                            ;
                            _this.getAllZones();
                            _this.toasterService.success("Bölge Başarıyla Eklendi");
                            _this.addZoneVisible = false;
                            _this.zone = "";
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DevolopmentListComponent.prototype.getAllZones = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.developmentService.getAllDevelopments().then(function (response) {
                            _this.devolopments = response;
                        })
                        //asdas
                    ];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DevolopmentListComponent.prototype.addTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new development_1.DevelopmentTask(this.addTask_Description, false, new Date(), 0, new Date(), new Date(), this.addTask_Header, this.addTask_Zone);
                        return [4 /*yield*/, this.developmentService.addDevelopmentTask(request).then(function (response) {
                                _this.getAllDevelopments(_this.searchTaskForm.value.searchTask_IsCompleted, _this.searchTaskForm.value.searchTask_DevelopmentId);
                                ;
                                _this.toasterService.success("Görev Başarıyla Eklendi");
                                _this.addTaskVisible = false;
                                _this.addTask_Description = "";
                                _this.addTask_Header = "";
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DevolopmentListComponent = __decorate([
        core_1.Component({
            selector: 'app-devolopment-list',
            templateUrl: './devolopment-list.component.html',
            styleUrls: ['./devolopment-list.component.css']
        })
    ], DevolopmentListComponent);
    return DevolopmentListComponent;
}());
exports.DevolopmentListComponent = DevolopmentListComponent;
