import { GM } from '../../../globle/base';
import { Cookie } from './cookie';
import { UUMS_SERVER, LOGIN_SERVER } from 'url-config';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { AjaxApi } from './ajax';


export class UserRegions {
  constructor(
    private getToken = new Cookie(),
    private gmAjax = new AjaxApi()
  ) { }

  /**
   * @description 获取用户
   * @method getUser
   */
  getUser() {
    if (!GM.get('userInfo')) {
      let userInfo;
      ajax({
        url: `${LOGIN_SERVER}/decrypt.do?token=${this.getToken.getCookie('clientCliToken')}`,
        responseType: 'json'
      })
        .pipe(map(res => {
          if (!res.response) {
            throw new Error(res['message']);
          }
          return res.response;
        }))
        .subscribe(response => {
          let userId: string;
          if (response && response.data.userId) {
            userId = response.data.userId;
          }
          let getUser = this.gmAjax.ajaxRequest(`${UUMS_SERVER}user/get`, { userId: `${userId}` }, { method: `get` }, true);
          let getAreas = this.gmAjax.ajaxRequest(`${UUMS_SERVER}area/tree`, null, { method: `get` }, true);
          let getOrganizations = this.gmAjax.ajaxRequest(`${UUMS_SERVER}organization/tree`, null, { method: `get` }, true);
          forkJoin([getUser, getAreas, getOrganizations])
            .subscribe(results => {
              userInfo = results[0].data;
              GM.set('userInfo', userInfo);
              this.setAreas(userInfo.organizations, results[1]);
              this.setOrganization(userInfo.organizations, results[2]);
            });
        });
    }
  }

  /**
   * @description 设置辖区数据
   * @method setAreas
   * @param {Array} arr organizations数据
   * @param {object} response 请求数据
   */
  setAreas(arr, response) {
    let arrayAreas: Array<object>[] = [];
    arr.forEach(element => {
      let strAreaId = element.areaId;
      let pAreaData = this.getDataFromAreaId(strAreaId, response.data);
      if (pAreaData != null) {
        arrayAreas.push(pAreaData);
      }
    });
    this.setAreaSql(arrayAreas);
    GM.get('userInfo').areas = arrayAreas;
  }

  /**
   * @description 根据辖区ID获取辖区数据
   * @method getDataFromAreaId
   * @param {String} strAreaId
   * @param {Array} arrayData
   * @return {object||null} 成功返回辖区数据，不成功返回null
   */
  getDataFromAreaId(strAreaId, arrayData) {
    if (arrayData == null) {
      return null;
    }
    for (let ii = 0; ii < arrayData.length; ii++) {
      let pData = arrayData[ii];
      if (pData.id === strAreaId) {
        return pData;
      } else {
        if (pData.childrens) {
          let result = this.getDataFromAreaId(strAreaId, pData.childrens);
          if (result != null) {
            return result;
          }
        }
      }
    }
  }

  /**
   * @description 设置区域对应的SQL
   * @method setAreaSql
   * @param {Array} areas 要设置的区域数组
   */
  setAreaSql(areas) {
    if (areas == null || areas.length <= 0) {
      return;
    }
    for (let ii = 0; ii < areas.length; ii++) {
      let pArea = areas[ii];
      let arrayTemp = this.getArrayCodesFromArea(pArea);
      if (arrayTemp != null) {
        pArea.whereSql = arrayTemp.join(',');
      }
      if (pArea.childrens) {
        this.setAreaSql(pArea.childrens);
      }
    }
  }

  /**
   * @description 根据辖区数据获取相应的sql
   * @method getArrayCodesFromArea
   * @param {Object} pAreaData 辖区数据
   * @return {String||null} 成功就返回相应的sql,不成功返回null
   */
  getArrayCodesFromArea(pAreaData) {
    if (pAreaData == null) {
      return null;
    }
    if (pAreaData.code.substring(2) === '0000') {
      // 省级不做筛选
      return;
    }
    let result = null;
    if (pAreaData.childrens) {
      // 市级，如果有子辖区，则拼接子辖区对应的代码
      let arrayCode = [];
      for (let ii = 0; ii < pAreaData.childrens.length; ii++) {
        arrayCode.push('\'' + pAreaData.childrens[ii].code + '\'');
      }
      result = arrayCode;
    } else {
      result = ['\'' + pAreaData.code + '\''];
    }
    return result;
  }

  /**
     * @description 设置组织机构信息
     * @method setOrganization
     * @param {Array} organizations 机构合集
     * @param {object} response 请求数据
     */
  setOrganization(organizations, response) {
    let arrayAllData = this.getAllNodes(response.data, 'childrens');
    let arrayOrganizations = [];
    for (let ii = 0; ii < organizations.length; ii++) {
      let strId = organizations[ii].id;
      for (let jj = 0; jj < arrayAllData.length; jj++) {
        if (arrayAllData[jj].id === strId) {
          arrayOrganizations.push(arrayAllData[jj]);
          break;
        }
      }
    }
    GM.get('userInfo').organizations = arrayOrganizations;
  }

  /**
   * @description 获取树形节点所有节点集合
   * @method getAllNodes
   * @param {Array} arrayNodes 节点集合
   * @param {String} attChildren 子节点属性名称,默认为‘children’
   * @return {Array} 节点集合
   */
  getAllNodes(arrayNodes, attChildren) {
    if (arrayNodes == null) {
      return [];
    }
    attChildren = attChildren == null ? 'children' : attChildren;
    let result = [];
    for (let ii = 0; ii < arrayNodes.length; ii++) {
      let pNode = arrayNodes[ii];
      result.push(pNode);
      if (pNode[attChildren]) {
        let arrayTempNodes = this.getAllNodes(pNode[attChildren], attChildren);
        // tslint:disable-next-line:no-unused-expression
        [...result, ...arrayTempNodes];
      }
    }
    return result;
  }

}
