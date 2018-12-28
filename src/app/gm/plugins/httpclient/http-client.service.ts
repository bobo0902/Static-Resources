/**
 * @description rest请求
 * @author xb
 */
import { Injectable } from '@angular/core';
import { Observable, throwError, from , forkJoin } from 'rxjs';
import { retry, catchError, map, debounceTime } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpclientBaseService } from './base.service';
import { GmArray, AjaxApi } from '../../../common/api';
import { ajax } from 'rxjs/ajax';

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

interface Result {
  success: boolean;
  data: Array<object>;
  originalResponse?: Array<object>;
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(
    private http: HttpClient
  ) { }
  private httpclientBaseService = new HttpclientBaseService();
  private ajax = new AjaxApi();
  private gmArray = new GmArray();

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
        debounceTime(1000),
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
        debounceTime(1000),
        retry(3),
        catchError(err => this.handleError(err))
      );
  }
  /**
   * @description 多次请求
   * @param url 请求路径
   * @param requestTimes 分几次请求
   * @param multiAttName 需要分解的属性名
   * @param gmParams 请求参数
   * @param options 自定义设置
   */
  multipleGetRequest(url: string, requestTimes: number, multiAttName?: string, gmParams?: object, options?: GmOptions): Observable<any> {
    let requestList: Array<object> = [];
    let arrayItems: Array<object> = [];
    // let result$;
    // 分割数组
    if (gmParams) {
      arrayItems = this.gmArray.getMeanArrays(gmParams[multiAttName], requestTimes);
    }

    let arrayItemsLen = arrayItems.length;
    for (let i = 0; i < requestTimes; i++) {
      let gmParamsClone = { ...gmParams };
      if (arrayItemsLen > 0) {
        gmParamsClone[multiAttName] = arrayItems[i];
      }
      // 使用同步请求页面阻塞，体验不好
      // requestList.push(this.ajax.ajaxRequest(url, gmParamsClone, { method: `get` }, true));
      requestList.push(this.getRequest(url, gmParamsClone));
    }
    // forkJoin(requestList).subscribe(results => {
    //   let res = this.processResult(results);
    //   result$ = Observable.create(function (observer) {
    //     observer.next(res);
    //   });
    // });
    // return result$;
    return forkJoin(requestList);
  }

  /**
   * @description 处理多次请求数据
   * @param results 待处理数据
   */
  processResult(results: Array<Result>) {
    let result: Result = {
      success: true,
      data: [],
      originalResponse: results
    };
    if (this.gmArray.isArray(results)) {
      results.forEach(e => {
        if (!e.success) {
          console.error(`请求数据失败`);
          return;
        }
        result.data = [...result.data, ...e.data];
      });
    }
    return result;
   }
}
