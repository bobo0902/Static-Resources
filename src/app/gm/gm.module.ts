import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.modules';


// 框架模版
export * from './frames';

// 管道相关
export * from './plugins/pipes';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    SharedModule
  ]
})
export class GmModule { }
