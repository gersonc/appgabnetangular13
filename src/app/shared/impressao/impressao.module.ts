import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ImpressaoComponent } from './impressao.component';
import {NgxPrintModule} from "ngx-print";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { ImpressaoBotaoComponent } from './impressao-botao/impressao-botao.component';
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    // ImpressaoComponent,
    ImpressaoBotaoComponent
  ],
    imports: [
        CommonModule,
        NgxPrintModule,
        OverlayPanelModule,
        ButtonModule
    ],
  exports: [
    // ImpressaoComponent,
    ImpressaoBotaoComponent
  ]
})
export class ImpressaoModule { }
