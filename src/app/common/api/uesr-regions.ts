import { GM } from 'src/globle/base';
import { AjaxApi } from './ajax';
import { UUMS_SERVER, LOGIN_SERVER } from 'src/globle/urlconfig';
import { mergeMap } from 'rxjs/operators';


class UserRegions {
  constructor(
    private ajax = new AjaxApi()
  ) { }

  /**
   * @description 获取用户
   * @method getUser
   */
  getUser() {
    if (!GM.get('userInfo')) {
      this.ajax.ajaxRequest(`${LOGIN_SERVER}/decrypt.do`, null, { method: 'get' }, true)
        .pipe(mergeMap(appResponse => {
          let userId: string;
          if (appResponse && appResponse.userId) {
            userId = appResponse.userId;
          }
          return this.ajax.ajaxRequest(`${UUMS_SERVER}user/get`, { userId: userId });
        }));
    }
  }
}
