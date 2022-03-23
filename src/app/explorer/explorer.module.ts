import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExplorerRoutingModule} from "./explorer.routing.module";
import {ExplorerComponent} from "./explorer.component";
import {ExplorerListagemComponent} from "./explorer-listagem/explorer-listagem.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AvatarModule} from "primeng/avatar";
import {CardModule} from "primeng/card";




@NgModule({
  declarations: [
    ExplorerComponent,
    ExplorerListagemComponent
  ],
    imports: [
        CommonModule,
        ExplorerRoutingModule,
        OverlayPanelModule,
        AvatarModule,
        CardModule,
    ],
  exports: [
    ExplorerComponent
  ]
})
export class ExplorerModule { }
