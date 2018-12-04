import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
  @Input() gmAllowClear: boolean;
  @Input() gmPlaceHolder: string;
  @Input() gmDisabled: boolean;
  @Input() gmShowSearch: boolean;
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
  @Input() gmDisplayWith;
  @Input() ngModel: string | string[];

  // 声明
  nzAllowClear: boolean;
  nzPlaceHolder: string;
  nzDisabled: boolean;
  nzShowSearch: boolean;
  nzDropdownMatchSelectWidth: boolean;
  nzDropdownStyle: { [key: string]: string; };
  nzMultiple: boolean;
  nzSize: string;
  nzCheckable: boolean;
  nzShowExpand: boolean;
  nzShowLine: boolean;
  nzAsyncData: boolean;
  nzNodes: [];
  nzDefaultExpandAll: boolean;
  nzDefaultExpandedKeys: string[];
  nzDisplayWith;
  // 监听绑定的值，与外层的ngModel相互绑定
  set nzModel(val: any) {
    if (val !== this.ngModel) {
      this.ngModel = val;
    }
  }
  get nzModel(): any {
    return this.ngModel;
  }

  ngOnInit() {
    // 初始化
    this.nzAllowClear = this.gmAllowClear;
    this.nzPlaceHolder = this.gmPlaceHolder;
    this.nzDisabled = this.gmDisabled;
    this.nzShowSearch = this.gmShowSearch;
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
    this.nzDisplayWith = this.gmDisplayWith;
  }

}
