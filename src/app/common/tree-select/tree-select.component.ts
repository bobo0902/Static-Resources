import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GM } from '../../../globle/base';

@Component({
  selector: 'gm-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: ['./tree-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true
    }]
})
export class TreeSelectComponent implements OnInit {

  constructor() { }
  // 引入
  @Input() gmPlaceHolder: string;
  @Input() gmDisabled: boolean;
  @Input() gmDropdownMatchSelectWidth: boolean;
  @Input() gmDropdownStyle: { [key: string]: string; };
  @Input() gmMultiple: boolean;
  @Input() gmSize: string;
  @Input() gmCheckable: boolean;
  @Input() gmShowExpand: boolean;
  @Input() gmShowLine: boolean;
  @Input() gmAsyncData: boolean;
  @Input() gmNodes: [];
  @Input() gmDefaultExpandAll: boolean;
  @Input() gmDefaultExpandedKeys: string[];
  @Input() ngModel: string | string[];
  @Input() config: object;

  // 声明
  nzPlaceHolder: string;
  nzDisabled: boolean;
  nzDropdownMatchSelectWidth: boolean;
  nzDropdownStyle: { [key: string]: string; };
  nzMultiple: boolean;
  nzSize: string;
  nzCheckable: boolean;
  nzShowExpand: boolean;
  nzShowLine: boolean;
  nzAsyncData: boolean;
  nzNodes: object [];
  nzDefaultExpandAll: boolean;
  nzDefaultExpandedKeys: string[];
  registerOnChange(fn: (value: any) => void) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  writeValue(value: any) { }
  onChangeCallback = (value: any) => { };
  onTouchedCallback = (value: any) => { };
  // 监听绑定的值，与外层的ngModel相互绑定
  set nzModel(val: any) {
    if (val !== this.ngModel) {
      this.ngModel = val;
    }
  }
  get nzModel(): any {
    return this.ngModel;
  }
  /**
   * @description 初始化树节点数据
   * @method initTreeNodeList
   * @param {Array} arr 待处理数组
   */
  initTreeNodeList(arr: object[]) {
    if (arr && arr.length > 0) {
      arr.forEach(element => {
        // if (this.config['title'] !== 'title') {
        //   Object.assign(element, { title: element[this.config['title']], originalTitle: element['title']});
        // }
        if (!element[this.config['key']]) {
          element[this.config['key']] = null;
         }
        Object.assign(element, { key: element[this.config['key']], children: element['childrens'] });
        if (element['childrens']) {
          this.initTreeNodeList(element['childrens']);
         }
      });
    }
    return arr;
  }

  ngOnInit() {
    // 初始化
    this.nzPlaceHolder = this.gmPlaceHolder;
    this.nzDisabled = this.gmDisabled;
    this.nzDropdownMatchSelectWidth = this.gmDropdownMatchSelectWidth;
    this.nzDropdownStyle = this.gmDropdownStyle;
    this.nzMultiple = this.gmMultiple;
    this.nzSize = this.gmSize;
    this.nzCheckable = this.gmCheckable;
    this.nzShowExpand = this.gmShowExpand;
    this.nzShowLine = this.gmShowLine;
    this.nzAsyncData = this.gmAsyncData;
    this.nzDefaultExpandAll = this.gmDefaultExpandAll;
    this.nzDefaultExpandedKeys = this.gmDefaultExpandedKeys;
    let treeNodeList = [...GM.get('userInfo').areas];
    // this.nzNodes = this.initTreeNodeList(treeNodeList);
    this.nzNodes = [{
      title: 'parent 1',
      key: '100',
      children: [{
        title: 'parent 1-0',
        key: '1001',
        children: [
          { title: 'leaf 1-0-0', key: '10010', isLeaf: true },
          { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
        ]
      }, {
        title: 'parent 1-1',
        key: '1002',
        children: [
          { title: 'leaf 1-1-0', key: '10020', isLeaf: true }
        ]
      }]
    }];
    console.log(this.nzNodes);
  }

}
