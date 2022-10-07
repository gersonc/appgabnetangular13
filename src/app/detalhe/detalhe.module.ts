import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalheComponent } from './detalhe.component';
import {ScrollPanelModule} from "primeng/scrollpanel";
import {KillViewModule} from "../shared/kill-view/kill-view.module";
import {ExplorerModule} from "../explorer/explorer.module";
import {QuillModule} from "ngx-quill";
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import {ImpressaoModule} from "../shared/impressao/impressao.module";
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    DetalheComponent
  ],
  imports: [
    CommonModule,
    ScrollPanelModule,
    KillViewModule,
    ExplorerModule,
    QuillModule,
    ExporterAcessoModule,
    ImpressaoModule,
    ButtonModule
  ],
  exports: [
    DetalheComponent
  ]
})
export class DetalheModule { }
