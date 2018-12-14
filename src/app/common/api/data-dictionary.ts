import { GM } from '../../../globle/base';
import { Pipe, PipeTransform } from '@angular/core';

const SysDicOper = {
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
/*
 * Usage:
 *   value | transformDic:dicName
 * Example:
 *   {{ '1' | transformDic:'登记类型' }}
*/
@Pipe({ name: 'transformDic' })
export class TransformDicPipe implements PipeTransform {
  transform(value: string, dicName: string): string {
    if (!value) { return value; }
    let newValue: string, arr = SysDicOper.dicData[dicName];
    if (typeof value !== 'string' || !arr) {
      throw new Error('Invalid pipe argument for transformDic');
    }
    let newArr = arr.find(element => element.value === value);
    if (newArr) {
      newValue = newArr.label;
    }
    return newValue;
  }
}
