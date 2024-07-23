"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HttpClientService = void 0;
var core_1 = require("@angular/core");
var ClientUrls_1 = require("../models/const/ClientUrls");
var HttpClientService = /** @class */ (function () {
    function HttpClientService(httpClient) {
        this.httpClient = httpClient;
    }
    HttpClientService.prototype.url = function (requestParameter) {
        return (requestParameter.baseUrl ? requestParameter.baseUrl : ClientUrls_1.ClientUrls.baseUrl) + "/" + requestParameter.controller + (requestParameter.action ? "/" + requestParameter.action : '');
    };
    HttpClientService.prototype.get = function (requestParameter, id) {
        var url = '';
        if (requestParameter.fullEndPoint)
            url = requestParameter.fullEndPoint;
        else
            url = "" + this.url(requestParameter) + (id ? "/" + id : '') + (requestParameter.queryString ? "?" + requestParameter.queryString : '');
        return this.httpClient.get(url, {
            headers: requestParameter.headers,
            responseType: requestParameter.responseType
        });
    };
    HttpClientService.prototype.get_new = function (requestParameter, id) {
        var url = '';
        if (requestParameter.fullEndPoint)
            url = requestParameter.fullEndPoint;
        else
            url = "" + this.url(requestParameter) + (id ? "/" + id : '') + (requestParameter.queryString ? "?" + requestParameter.queryString : '');
        return this.httpClient.get(url, {
            headers: requestParameter.headers,
            responseType: requestParameter.responseType
        });
    };
    HttpClientService.prototype.post = function (requestParameter, body) {
        var url = '';
        if (requestParameter.fullEndPoint)
            url = requestParameter.fullEndPoint;
        else
            url = "" + this.url(requestParameter) + (requestParameter.queryString ? "?" + requestParameter.queryString : '');
        return this.httpClient.post(url, body, {
            headers: requestParameter.headers,
            responseType: requestParameter.responseType
        });
    };
    HttpClientService.prototype.put = function (requestParameter, body) {
        var url = '';
        if (requestParameter.fullEndPoint)
            url = requestParameter.fullEndPoint;
        else
            url = "" + this.url(requestParameter) + (requestParameter.queryString ? "?" + requestParameter.queryString : '');
        return this.httpClient.put(url, body, {
            headers: requestParameter.headers,
            responseType: requestParameter.responseType
        });
    };
    HttpClientService.prototype["delete"] = function (requestParameter, id) {
        var url = '';
        if (requestParameter.fullEndPoint)
            url = requestParameter.fullEndPoint;
        else
            url = this.url(requestParameter) + "/" + id + (requestParameter.queryString ? "?" + requestParameter.queryString : '');
        return this.httpClient["delete"](url, {
            headers: requestParameter.headers,
            responseType: requestParameter.responseType
        });
    };
    HttpClientService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], HttpClientService);
    return HttpClientService;
}());
exports.HttpClientService = HttpClientService;
