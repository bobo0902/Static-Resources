import { GM } from '../../../globle/base';

export const SysDicOper = {
  dicData: [],
  /**
   * @method recordDic 记录数据字典
   * @param {object} rData 后台请求返回的数据
   */
  recordDic(rData, childrens = rData.childrens) {
    if (childrens) { this.dicData[rData.label] = rData.childrens; }
  },
  getDicData: true
};

GM.set('SysDicOper', SysDicOper);

export { GM };
