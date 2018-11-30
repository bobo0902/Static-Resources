import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

export * from './plugins/httpclient';
export * from '../common/api';
export * from '../common/select';

export * from '../../globle/base';
export * from '../../globle/urlconfig';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
  ]
})
export class GmModule { }
