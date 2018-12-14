import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

export * from './plugins/httpclient';
export * from './plugins/http-interceptors';
export * from '../common/api';
export * from '../common/select';
export * from '../common/tree-select';

export * from '../../globle/base';
export * from '../../globle/urlconfig';

// 框架模版
export * from './frames';
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
  ]
})
export class GmModule { }
