import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DatePickerComponent } from './common/date-picker/date-picker/date-picker.component';
import { TreeSelectComponent } from './common/tree-select/tree-select.component';

@NgModule({
  declarations: [
    AppComponent,
    DatePickerComponent,
    TreeSelectComponent
  ],
  imports: [
    NgZorroAntdModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
