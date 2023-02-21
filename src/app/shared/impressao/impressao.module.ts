import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressaoBotaoComponent } from './impressao-botao/impressao-botao.component';
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    ImpressaoBotaoComponent
  ],
    imports: [
        CommonModule,
        ButtonModule
    ],
  exports: [
    ImpressaoBotaoComponent
  ]
})
export class ImpressaoModule { }
