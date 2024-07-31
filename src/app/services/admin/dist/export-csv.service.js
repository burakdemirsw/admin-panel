"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ExportCsvService = void 0;
var core_1 = require("@angular/core");
var XLSX = require("xlsx");
var ExportCsvService = /** @class */ (function () {
    function ExportCsvService() {
    }
    ExportCsvService.prototype.exportToCsv = function (data, filename) {
        var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, filename);
        // Dosya adı ve seçenekler
        XLSX.writeFile(wb, filename + '.xlsx');
    };
    ExportCsvService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ExportCsvService);
    return ExportCsvService;
}());
exports.ExportCsvService = ExportCsvService;
