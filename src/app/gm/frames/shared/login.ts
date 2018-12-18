import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Cookie } from '../../../common/api';
import { APP_KEY, LOGIN_SERVER } from 'url-config';

export class Login {
  constructor() {
  }
  private cookie = new Cookie();
  /**
   * @description 登录
   * @method login
   */
  login() {
    ajax({
      url: `${LOGIN_SERVER}login?username=gss&password=As5RPtiDBTUGkv3OzPsQRg==&appKey=${APP_KEY}`,
      responseType: 'json',
      async: false
    }).pipe(
      map(res => {
        if (!res.response) {
          throw new Error('Value expected!');
        }
        return res.response;
      }),
      catchError(err => of([]))
    ).subscribe(response => {
      this.cookie.addCookie('clientServerToken', response.data.gmsso_ser_ec_key, (1 / 48));
      this.cookie.addCookie('clientCliToken', response.data.gmsso_cli_ec_key, (1 / 48));
    });
  }
  /**
   * @description 验证令牌是否有效
   * @method isTokenValid
   */
  isTokenValid(strToken) {
    ajax({
      url: `${LOGIN_SERVER}checkTokenByAppKey?token=${strToken}&appKey=${APP_KEY}`,
      responseType: 'json',
      async: false
    }).pipe(
      map(res => {
        if (!res.response) {
          throw new Error('Value expected!');
        }
        return res.response;
      }),
      catchError(err => of([]))
    ).subscribe(response => {
      if (response != null && response.tokenInvalid === false) {
        // token可用
        this.cookie.addCookie('clientServerToken', response.data.gmsso_ser_ec_key, (1 / 48));
      } else {
        this.login();
      }
    });
  }
}
