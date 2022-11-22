import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalheComponent } from './detalhe.component';
import {ScrollPanelModule} from "primeng/scrollpanel";
import {KillViewModule} from "../kill-view/kill-view.module";
import {ExplorerModule} from "../../explorer/explorer.module";
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
        ButtonModule,
        DialogModule
    ],
  exports: [
    DetalheComponent
  ]
})
export class DetalheModule {
  constructor() {
    console.log('CARREGANDO DETALHE ...................................');
  }
}
