import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgZorroAntdModule } from 'gm-zorro-antd';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgZorroAntdModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
