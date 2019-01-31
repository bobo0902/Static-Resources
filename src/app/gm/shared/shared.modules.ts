import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// 自定义
import { Fram1Component } from '../frames';
// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';

const THIRDMODULES = [
  NgZorroAntdModule,
];
// #endregion

// #region componets & directives
const COMPONENTS = [Fram1Component];
// #endregion

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // third libs
    ...THIRDMODULES,
  ],
  exports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // third libs
    ...THIRDMODULES,
    ...COMPONENTS,
  ]
})
export class SharedModule { }
