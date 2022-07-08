import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExporterCelulaComponent } from './exporter-celula/exporter-celula.component';
import { ExporterExpandidoComponent } from './exporter-expandido/exporter-expandido.component';
import { ExporterDetalheComponent } from './exporter-detalhe/exporter-detalhe.component';
import { ExporterViewComponent } from './exporter-view/exporter-view.component';
import { ExporterImpressaoDetalheComponent } from './exporter-impressao-detalhe/exporter-impressao-detalhe.component';
import {EmailTelefoneCelularModule} from "../email-telefone-celular/email-telefone-celular.module";
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    ExporterCelulaComponent,
    ExporterExpandidoComponent,
    ExporterDetalheComponent,
    ExporterViewComponent,
    ExporterImpressaoDetalheComponent
  ],
  imports: [
    CommonModule,
    EmailTelefoneCelularModule,
    ButtonModule
  ],
  exports: [
    ExporterCelulaComponent,
    ExporterExpandidoComponent,
    ExporterDetalheComponent,
    ExporterViewComponent,
    ExporterImpressaoDetalheComponent
  ]
})
export class ExporterAcessoModule { }
