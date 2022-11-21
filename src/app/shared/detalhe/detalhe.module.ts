import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalheComponent } from './detalhe.component';
import {ScrollPanelModule} from "primeng/scrollpanel";
import {KillViewModule} from "../kill-view/kill-view.module";
import {ExplorerModule} from "../../explorer/explorer.module";
import {QuillModule} from "ngx-quill";
import {ExporterAcessoModule} from "../exporter-acesso/exporter-acesso.module";
import {ImpressaoModule} from "../impressao/impressao.module";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";



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
        ButtonModule,
        DialogModule
    ],
  exports: [
    DetalheComponent
  ]
})
export class DetalheModule { }
