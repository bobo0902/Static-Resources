export const APP_KEY = 'GM_NR';
export const UUMS_SERVER = 'http://192.168.5.222:8058/uums-server/';
export const LOGIN_SERVER = 'http://192.168.5.35:8058/gm-sso-server/';
export const ZRZY_SERVER = 'http://192.168.5.222:8038/zrzy-register-server/';
// 请求地址
export const RESTURL = {
  login: `${LOGIN_SERVER}login`,
  checkTokenByAppKey: `${LOGIN_SERVER}checkTokenByAppKey`,
  // 综合查询
  integratedQuery: `${ZRZY_SERVER}api/queryRegistrationInfo/getComprehensivePageList`,
  getComprehensiveInfo: `${ZRZY_SERVER}api/queryRegistrationInfo/getComprehensiveInfo`// 获取详情表格数据
};
