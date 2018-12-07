import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { TreeSelectComponent } from './tree-select.component';
import { TreeSelectService } from './tree-select.service';

@NgModule({
  declarations: [TreeSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports: [
    TreeSelectComponent
  ],
  providers: [TreeSelectService]
})
export class TreeSelectModule { }
