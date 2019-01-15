import { of } from 'rxjs';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { retry, map, catchError } from 'rxjs/operators';
import { Cookie } from './cookie';

/**
 * @enum ajaxApi ajax API
 * @author xb
 */

export class AjaxApi {
  /**
   * @method ajaxRequest
   * @description ajax请求
   * @param {string} url  请求地址
   * @param {object} data 请求参数
   * @param {object} settings 设置
   * @param {boolean} btoken 是否添加token
   */
  ajaxRequest(url, data, settings?: AjaxRequest, btoken?: boolean) {
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
      catchError(err => of([err]))
    );
    return apiData$;
  }

  /**
   * @method param
   * @description get请求处理数据
   * @param {object} obj 请求对象
   */
  param(obj: object) {
    let query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    // tslint:disable-next-line:forin
    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          innerObj = {};
          innerObj[name] = subValue;
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
