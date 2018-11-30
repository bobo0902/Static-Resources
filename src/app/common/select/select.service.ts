import { Injectable } from '@angular/core';
import { GM } from '../api/data-dictionary';
import { APP_KEY, UUMS_SERVER } from '../../../globle/urlconfig';
import { mergeMap } from 'rxjs/operators';
import { AjaxApi } from '../api';

@Injectable({
  providedIn: 'root'
})
export class SelectService {

  constructor(
  ) { }
  private ajax = new AjaxApi();

  /**
   * @method prepareDicData
   * @description 获取系统的AppInfo,获取数据字典信息
   */
  public prepareDicData() {
    return this.ajax.ajaxRequest(`${UUMS_SERVER}app/get`, { name: `${APP_KEY}` }, { method: 'get' }, true)
      .pipe(mergeMap(appResponse => {
        if (appResponse && appResponse.data) {
          let records = appResponse.data;
          GM.set('AppInfo', records);
        }
        return this.ajax.ajaxRequest(`${UUMS_SERVER}dict/tree`, { appId: GM.get('AppInfo').id }, { method: 'get' }, true);
      }));
  }

}

