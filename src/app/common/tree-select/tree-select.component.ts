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
  // 监听绑定的值，与外层的ngModel相互绑定
  set nzModel(val: any) {
    if (val !== this.ngModel) {
      this.ngModel = val;
      this.onChangeCallback(val);
    }
  }
  get nzModel(): any {
    return this.ngModel;
  }
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
  nzNodes: object[];
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
        } else {
          element['isLeaf'] = true;
        }
      });
    }
    return arr;
  }

  ngOnInit() {
    // 初始化
    this.nzPlaceHolder = this.gmPlaceHolder;
    this.nzDisabled = this.gmDisabled;
    this.nzDropdownMatchSelectWidth = this.gmDropdownMatchSelectWidth || true;
    this.nzDropdownStyle = this.gmDropdownStyle || { 'max-height': '300px' };
    this.nzMultiple = this.gmMultiple || false;
    this.nzSize = this.gmSize;
    this.nzCheckable = this.gmCheckable || false;
    this.nzShowExpand = this.gmShowExpand || true;
    this.nzShowLine = this.gmShowLine || false;
    this.nzDefaultExpandAll = this.gmDefaultExpandAll || false;
    this.nzDefaultExpandedKeys = this.gmDefaultExpandedKeys;
    this.nzNodes = this.initTreeNodeList(GM.get('userInfo').areas);
  }

}
