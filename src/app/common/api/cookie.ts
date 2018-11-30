/**
 * @enum cookie API
 * @author xb
 */

export class Cookie {
  constructor() {

  }
  /**
     * @description 添加一个cookie
     * @method addCookie
     * @param {String} name cookie名称
     * @param {String} value cookie值
     * @param {Number} expiresDays 多少天后会过期
     */
  addCookie(name, value, expiresDays) {
    let cookieString = name + '=' + escape(value);
    if (expiresDays > 0) {
      let date = new Date();
      date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
      cookieString = cookieString + ';expires=' + date.toUTCString();
    }
    cookieString += ';path=/';
    document.cookie = cookieString;
  }
  /**
   * @method removeCookie
   * @param {String} name 要删除的cookie名称
   */
  removeCookie(name) {
    let date = new Date();
    date.setTime(date.getTime() - 1);
    let cookieString = name + '=temp' + ';expires=' + date.toUTCString();
    cookieString += ';path=/';
    document.cookie = cookieString;
  }
  /**
   * @description 获取指定名称的cookie值
   * @method getCookie
   * @param {String} name cookie名称
   * @return {String} cookie值
   */
  getCookie(name) {
    let strCookie = document.cookie;
    let arrCookie = strCookie.split('; ');
    for (let i = 0; i < arrCookie.length; i++) {
      let arr = arrCookie[i].split('=');
      if (arr[0] === name) {
        return unescape(arr[1]);
      }
    }
  }
}
