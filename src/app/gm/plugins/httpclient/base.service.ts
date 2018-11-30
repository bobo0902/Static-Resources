import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpclientBaseService {

  constructor() { }

  param(obj): string {
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
