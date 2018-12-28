/**
 * @enum array API
 * @author xb
 */

export class GmArray {
  constructor() {
  }

  /**
   * @description 判断是否为数组
   * @method isArray
   * @param obj 待判断对象
   * @returns {boolean} 判断结果
   */
  isArray(obj): boolean {
    if (!obj) { return false; }
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  /**
   * @description 将一个数组分成几个同等长度的数组
   * @method sliceArray
   * @param arr 分割的原数组
   * @param size 每个子数组的长度
   */
  sliceArray(arr: Array<any>, size: number): Array<any> {
    let newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }

  /**
   * @description 将数组均分为指定子元素个数的数组
   * @method getMeanArrays
   * @param {Array} pArray 数据
   * @param {Number} numMean 均分个数
   * @return {Array} 均分后数组结果
   */
  getMeanArrays(pArray: Array<any>, numMean: number) {
    if (!this.isArray(pArray) || numMean == null || Number.isNaN(numMean)) {
      return null;
    }
    let result = [];
    if (pArray.length <= numMean) {
      for (let ii = 0; ii < pArray.length; ii++) {
        result.push([pArray[ii]]);
      }
    } else {
      let nBase = Math.floor(pArray.length / numMean);
      let nRemainder = pArray.length % numMean;
      let nArrayIndex = 0;
      for (let jj = 0; jj < numMean; jj++) {
        let itemArrayLength = nBase;
        let itemArray = [];
        if (result.length + 1 <= nRemainder) {
          itemArrayLength += 1;
        }
        for (let kk = 0; kk < itemArrayLength; kk++) {
          itemArray.push(pArray[nArrayIndex]);
          nArrayIndex++;
        }
        result.push(itemArray);
      }
    }
    return result;
  }
}
