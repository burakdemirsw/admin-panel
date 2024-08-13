import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientUrls } from '../models/const/ClientUrls';
import { RequestParameters } from '../models/parameters/requestParameters';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(private httpClient: HttpClient) { }

  private url(requestParameter: Partial<RequestParameters>): string {
    return `${requestParameter.baseUrl ? requestParameter.baseUrl : ClientUrls.baseUrl
      }/${requestParameter.controller}${requestParameter.action ? `/${requestParameter.action}` : ''
      }`;
  }

  get<T>(
    requestParameter: Partial<RequestParameters>,
    id?: string
  ): Observable<T[]> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${id ? `/${id}` : ''}${requestParameter.queryString ? `?${requestParameter.queryString}` : ''
        }`;

    return this.httpClient.get<T[]>(url, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json',
    });
  }

  get_new<T>(
    requestParameter: Partial<RequestParameters>,
    id?: string
  ): Observable<any> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${id ? `/${id}` : ''}${requestParameter.queryString ? `?${requestParameter.queryString}` : ''
        }`;

    return this.httpClient.get<any>(url, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json',
    });
  }


  post<T>(
    requestParameter: Partial<RequestParameters>,
    body: Partial<any>
  ): Observable<any> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ''
        }`;


    return this.httpClient.post<T>(url, body, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json',
    });
  }

  put<T>(
    requestParameter: Partial<RequestParameters>,
    body: Partial<T>
  ): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ''
        }`;

    return this.httpClient.put<T>(url, body, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json',
    });
  }

  delete<T>(
    requestParameter: Partial<RequestParameters>,
    id: number | string
  ): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}/${id}${requestParameter.queryString ? `?${requestParameter.queryString}` : ''
        }`;

    return this.httpClient.delete<T>(url, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json',
    });
  }






}
