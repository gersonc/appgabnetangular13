import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ImpressaoComponent } from './impressao.component';
import {NgxPrintModule} from "ngx-print";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { ImpressaoBotaoComponent } from './impressao-botao/impressao-botao.component';
import {ButtonModule} from "primeng/button";
import { PrintbotaoComponent } from './printbotao/printbotao.component';



@NgModule({
  declarations: [
    // ImpressaoComponent,
    ImpressaoBotaoComponent,
    PrintbotaoComponent
  ],
    imports: [
        CommonModule,
        NgxPrintModule,
        OverlayPanelModule,
        ButtonModule
    ],
  exports: [
    // ImpressaoComponent,
    ImpressaoBotaoComponent,
    PrintbotaoComponent
  ]
})
export class ImpressaoModule { }
