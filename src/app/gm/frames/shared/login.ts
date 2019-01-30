import { NzMessageService } from 'gm-zorro-antd';
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
   */
  login() {
    let pasdword = this.gmDes.encryptByDES('gss123123');
    console.log(pasdword);
    console.log('解密：' + this.gmDes.decryptByDES(pasdword));
    this.gmAjax.ajaxRequest(
      `${LOGIN_SERVER}login`,
      { username: `gss`, password: pasdword, appKey: APP_KEY },
      { method: `get` }
    ).subscribe(response => {
      if (!response.data || response.data.gmsso_ser_ec_key === '' || response.data.gmsso_cli_ec_key === '') {
        throw new Error(`获取token失败`);
      }
      this.cookie.addCookie('clientServerToken', response.data.gmsso_ser_ec_key, (1 / 48));
      this.cookie.addCookie('clientCliToken', response.data.gmsso_cli_ec_key);
    });
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
      { GMSSO_SERVER_EC: serverToken, appKey: APP_KEY, service: `http://192.168.5.35:8048/ldimp/registration-platform` }, // 暂时用假路径
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
