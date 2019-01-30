/**
 * @enum des API
 * @author xb
 */
import * as CryptoJS from 'crypto-js';

export class GmDes {
  constructor() {
  }
  /**
   * des加密
   * @param  strMessage 待加密字符串
   * @param  key 加密Key
   * @return 加密后结果
   */
  encryptByDES(strMessage: string, key?: string): string {
    key = key || '\u0067\u0072\u0065\u0061\u0074\u006d\u0061\u0070';
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let encrypted = CryptoJS.DES.encrypt(strMessage, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }
  /**
   * des解密
   * @param  strMessage 待解密字符串
   * @param  key 解密关键字
   * @return 解密结果
   */
  decryptByDES(strMessage: string, key?: string): string {
    key = key || '\u0067\u0072\u0065\u0061\u0074\u006d\u0061\u0070';
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let decrypted = CryptoJS.DES.decrypt(strMessage, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
