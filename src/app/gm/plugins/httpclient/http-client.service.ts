/**
 * @description rest请求
 * @author xb
 */
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpclientBaseService } from './base.service';
import { Cookie } from '../../../common/api/cookie';

export interface GmOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: string;
  withCredentials?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(
    private http: HttpClient
  ) { }
  private cookie = new Cookie();
  private httpclientBaseService = new HttpclientBaseService();

  /**
   * @description 错误处理
   * @param error HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  /**
   * @description get方法
   * @param url 请求地址
   * @param gmParams 请求参数
   * @param options 自定义设置
   */
  getRequest(url: string, gmParams?: object, options?: GmOptions): Observable<any> {
    // 处理请求头
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    // 添加时间戳，避免缓存
    let timestamp = +new Date();
    url += (url.indexOf('?') < 0 ? '?' : '&') + `timestamp=${String(timestamp)}`;
    // 处理请求参数
    if (gmParams) {
      url += `&${this.httpclientBaseService.param(gmParams)}`;
    }
    const getOptions = options ? Object.assign({ headers }, options) : { headers };
    return this.http.get<any>(url, getOptions)
      .pipe(
        retry(3),
        catchError(err => this.handleError(err))
      );
  }
  /**
   * @description post方法
   * @param url 请求地址
   * @param gmBody 请求参数
   * @param options 自定义设置
   */
  postRequest(url: string, gmBody?: any, options?: GmOptions): Observable<any> {
    let contentType: string;
    // tslint:disable-next-line:no-unused-expression
    options.responseType === 'json' ? contentType = 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded';

    // 处理请求头
    const headers = new HttpHeaders().set('Content-Type', contentType);
    const getOptions = options ? Object.assign({ headers }, options) : { headers };

    return this.http.post<any>(url, gmBody, getOptions)
      .pipe(
        retry(3),
        catchError(err => this.handleError(err))
      );
  }
}
