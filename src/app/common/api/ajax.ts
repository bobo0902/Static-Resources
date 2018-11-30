import { Subscriber, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { retry, map, catchError } from 'rxjs/operators';
import { Cookie } from './cookie';

/**
 * @enum ajaxApi ajax API
 * @author xb
 */

interface AjaxRequest {
  url?: string; // URL of the request
  body?: any;  // The body of the request
  user?: string;
  async?: boolean; // Whether the request is async
  method?: string; // Method of the request, such as GET, POST, PUT, PATCH, DELETE
  headers?: Object; // Optional headers
  timeout?: number;
  password?: string;
  hasContent?: boolean;
  crossDomain?: boolean; // true if a cross domain request, else false
  withCredentials?: boolean;
  createXHR?: () => XMLHttpRequest; // a function to override if you need to use an alternate XMLHttpRequest implementation
  progressSubscriber?: Subscriber<any>;
  responseType?: string;
}


export class AjaxApi  {
  /**
   * @method ajaxRequest
   * @description ajax请求
   * @param {string} url  请求地址
   * @param {object} data 请求参数
   * @param {object} settings 设置
   * @param {boolean} btoken 是否添加token
   */
  ajaxRequest(url, data, settings?: AjaxRequest, btoken?) {
    let headers = {};
    let getToken = new Cookie();
    if (settings && settings.method.toUpperCase() === 'GET') {
      url += `?${this.param(data)}`;
    }
    let defaultSettings: AjaxRequest = {
      url: url,
      method: 'POST',
      async: false,
      headers: headers,
      body: data,
      responseType: 'json'
    };
    if (settings) {
      Object.assign(defaultSettings, settings);
     }
    // 是否添加token
    if (btoken) {
      let token = getToken.getCookie('clientCliToken');
      headers['token'] = token;
    }
    const apiData$ = ajax(defaultSettings).pipe(
      retry(3), // Retry up to 3 times before failing
      map(res => {
        if (!res.response) {
          throw new Error('Value expected!');
        }
        return res.response;
      }),
      catchError(err => of([]))
    );
    return apiData$;
  }

  /**
   * @method param
   * @description get请求处理数据
   * @param {object} obj 请求对象
   */
  param(obj) {
    let query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    // tslint:disable-next-line:forin
    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.param(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        // tslint:disable-next-line:forin
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.param(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null) {
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }
    return query.length ? query.substr(0, query.length - 1) : query;
  }
}
