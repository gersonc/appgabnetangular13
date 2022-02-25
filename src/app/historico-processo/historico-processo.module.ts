import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { HistoricoProcessoComponent } from './historico-processo.component';
import { HistoricoProcessoListarComponent } from './historico-processo-listar/historico-processo-listar.component';
import {TableModule} from "primeng/table";
import {QuillModule} from "ngx-quill";
import { HistoricoProcessoFormComponent } from './historico-processo-form/historico-processo-form.component';
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {CalendarModule} from "primeng/calendar";
import {UtilModule} from "../util/util.module";
import {EditorModule} from "primeng/editor";




@NgModule({
  declarations: [
    HistoricoProcessoComponent,
    HistoricoProcessoListarComponent,
    HistoricoProcessoFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    QuillModule,
    TooltipModule,
    DialogModule,
    CalendarModule,
    UtilModule,
    EditorModule
  ],
  exports: [
    HistoricoProcessoComponent,
    HistoricoProcessoFormComponent
  ]
})
export class HistoricoProcessoModule { }
