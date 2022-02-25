import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricoProcessoComponent } from './historico-processo.component';
import { HistoricoProcessoListarComponent } from './historico-processo-listar/historico-processo-listar.component';
import {TableModule} from "primeng/table";
import {QuillModule} from "ngx-quill";



@NgModule({
  declarations: [
    HistoricoProcessoComponent,
    HistoricoProcessoListarComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    QuillModule
  ],
  exports: [
    HistoricoProcessoComponent
  ]
})
export class HistoricoProcessoModule { }
