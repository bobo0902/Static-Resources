/**
 * @description 数据字典下拉选择
 * @author xb
 */
import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { SelectService } from './select.service';
import { GM } from '../api';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
   * 自定义配置
   * label 显示字段
   * value 绑定字段
   */
interface SelectConfig {
  label: 'label';
  value: 'value';
}

@Component({
  selector: 'gm-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent), // 注入表单控件
      multi: true
    }]
})
export class SelectComponent implements OnInit {

  constructor(
    private selectService: SelectService
  ) { }
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
  // @Input()
  // set dataSource(val: any) {
  //   this._dataSource = val;
  //   this.options = this._dataTransform(this._dataSource); // 如果是本地数组或直接请求的数组直接复制
  // }
  // get dataSource(): any {
  //   return this._dataSource;
  // }

  // 引入
  @Input() gmMode: string;
  @Input() gmAllowClear: boolean;
  @Input() gmOpen: boolean;
  @Input() gmAutoFocus: boolean;
  @Input() gmDisabled: boolean;
  @Input() gmDropdownClassName: string;
  @Input() gmDropdownMatchSelectWidth: boolean;
  @Input() gmDropdownStyle: object;
  @Input() gmServerSearch: boolean;
  @Input() gmMaxMultipleCount: number;
  @Input() ngModel: string | Array<string>[];
  @Input() gmNotFoundContent: string;
  @Input() gmPlaceHolder: string;
  @Input() gmSize: string;
  @Input() dicType: string;
  // 声明
  options = [];
  nzMode: string;
  nzAllowClear: boolean;
  nzOpen: boolean;
  nzAutoFocus: boolean;
  nzDisabled: boolean;
  nzDropdownClassName: string;
  nzDropdownMatchSelectWidth: boolean;
  nzDropdownStyle: object;
  nzServerSearch: boolean;
  nzFilterOption: any;
  nzMaxMultipleCount: number;
  nzNotFoundContent: string;
  nzPlaceHolder: string;
  nzSize: string;
  registerOnChange(fn: (value: any) => void) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  writeValue(value: string) { }
  onChangeCallback = (value: any) => { };
  onTouchedCallback = (value: any) => { };
  // private _dataSource: any;

  /**
   * @method _dataTransform 处理下拉数据
   * @param data 待处理数组
   * @param dicType 字典类型
   */
  private _dataTransform(data: Array<any>, dicType) {
    let _data = [];
    if (!data[dicType]) { return; }
    for (let i = 0; i < data[dicType].length; i++) {
      _data[i] = {};
      _data[i].label = data[dicType][i].label;
      _data[i].value = data[dicType][i].value;
    }
    return _data;
  }
  ngOnInit() {
    // 初始化
    this.nzMode = this.gmMode || 'default';
    this.nzAllowClear = this.gmAllowClear;
    this.nzOpen = this.gmOpen;
    this.nzAutoFocus = this.gmAutoFocus;
    this.nzDisabled = this.gmDisabled;
    this.nzDropdownClassName = this.gmDropdownClassName;
    this.nzDropdownStyle = this.gmDropdownStyle;
    this.nzServerSearch = this.gmServerSearch;
    this.nzMaxMultipleCount = this.gmMaxMultipleCount;
    this.nzNotFoundContent = this.gmNotFoundContent;
    this.nzPlaceHolder = this.gmPlaceHolder;
    this.nzSize = this.gmSize;
    // 获取下拉列表数据
    if (GM.get('SysDicOper').getDicData) {
      GM.get('SysDicOper').getDicData = false;
      this.selectService.prepareDicData().subscribe(
        appResponse => {
          if (appResponse && appResponse.data) {
            let records = appResponse.data;
            records.forEach(element => {
              GM.get('SysDicOper').recordDic(element);
            });
            let dicData = GM.get('SysDicOper').dicData;
            this.options = this._dataTransform(dicData, this.dicType);
          }
        }
      );
    } else {
      let dicData = GM.get('SysDicOper').dicData;
      this.options = this._dataTransform(dicData, this.dicType);
    }
  }
}
