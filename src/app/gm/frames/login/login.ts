import { NzMessageService } from 'ng-zorro-antd';
import { Cookie, AjaxApi, GmDes } from '../../../common/api';
import { APP_KEY, LOGIN_SERVER } from 'url-config';

export class Login {

  constructor(
    private message: NzMessageService
  ) { }

  private cookie = new Cookie();
  private gmAjax = new AjaxApi();
  private gmDes = new GmDes();
  /**
   * @description 登录
   * @method login
   * @param username 用户名
   * @param password 密码
   * @param url 登录成功跳转地址
   */
  login(username: string, password: string, url: string) {
    let pasdword = this.gmDes.encryptByDES(password);
    this.gmAjax.ajaxRequest(
      `${LOGIN_SERVER}login`,
      { username: username, password: pasdword, appKey: APP_KEY },
      { method: `get` }
    ).subscribe(response => {
      if (!response.data || response.data.gmsso_ser_ec_key === '' || response.data.gmsso_cli_ec_key === '') {
        this.message.create('error', response.message);
        throw new Error(`获取token失败`);
      }
      this.cookie.addCookie('clientServerToken', response.data.gmsso_ser_ec_key, (1 / 48));
      this.cookie.addCookie('clientCliToken', response.data.gmsso_cli_ec_key);
      window.location.href = url;
    });
  }
  /**
   * @description 登出
   * @method logout
   * @param url 登出成功跳转地址
   */
  logout(url: string) {
    this.cookie.removeCookie('clientServerToken');
    this.cookie.removeCookie('clientCliToken');
    window.location.href = url;
  }
  /**
   * @description 验证令牌是否有效
   * @method isTokenValid
   * @param strToken token
   */
  isTokenValid(strToken: string) {
    this.gmAjax.ajaxRequest(
      `${LOGIN_SERVER}checkTokenByAppKey`,
      { token: strToken, appKey: APP_KEY },
      { method: `get` }
    )
      .subscribe(response => {
        if (response != null && response.tokenInvalid === false) {
          // token可用
          this.cookie.addCookie('clientServerToken', response.data.gmsso_ser_ec_key);
        } else {
          this.getNewToken(this.cookie.getCookie(`clientServerToken`));
        }
      });
  }
  /**
   * @description 获取新token
   * @method getNewToken
   * @param serverToken token
   */
  getNewToken(serverToken: string) {
    this.gmAjax.ajaxRequest(
      `${LOGIN_SERVER}login`,
      { GMSSO_SERVER_EC: serverToken, appKey: APP_KEY, service: document.location.origin },
      { method: `get` }
    ).subscribe(response => {
      if (response && response.success === true && response.data != null && response.data.gmsso_ser_ec_key !== '') {
        this.cookie.addCookie('clientServerToken', response.data.gmsso_ser_ec_key);
      } else {
        this.message.create('error', response.message);
      }
    });
  }
}
