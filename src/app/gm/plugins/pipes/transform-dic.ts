import { Pipe, PipeTransform } from '@angular/core';
import { SysDicOper } from '../../../common/api';

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
