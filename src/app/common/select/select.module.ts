import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'gm-zorro-antd';
import { SelectComponent } from './select.component';
import { SelectService } from './select.service';
@NgModule({
  declarations: [SelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports: [
    SelectComponent
  ],
  providers: [SelectService]
})

export class SelectModule { }
