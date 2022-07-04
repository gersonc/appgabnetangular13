import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressaoComponent } from './impressao.component';
import {NgxPrintModule} from "ngx-print";



@NgModule({
  declarations: [
    ImpressaoComponent
  ],
  imports: [
    CommonModule,
    NgxPrintModule
  ],
  exports: [
    ImpressaoComponent
  ]
})
export class ImpressaoModule { }
