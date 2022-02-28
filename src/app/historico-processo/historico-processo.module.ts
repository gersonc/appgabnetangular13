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
import {ScrollPanelModule} from "primeng/scrollpanel";
import {RippleModule} from "primeng/ripple";
import {PanelModule} from "primeng/panel";
import {MessageModule} from "primeng/message";
import { HistroricoProcessoDetalheComponent } from './histrorico-processo-detalhe/histrorico-processo-detalhe.component';
import { HistoricoProcessoExcluirComponent } from './historico-processo-excluir/historico-processo-excluir.component';
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ToastModule} from "primeng/toast";
import {ConfirmationService} from "primeng/api";



@NgModule({
  declarations: [
    HistoricoProcessoComponent,
    HistoricoProcessoListarComponent,
    HistoricoProcessoFormComponent,
    HistroricoProcessoDetalheComponent,
    HistoricoProcessoExcluirComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    //QuillModule,
    TooltipModule,
    DialogModule,
    CalendarModule,
    UtilModule,
    EditorModule,
    QuillModule.forRoot(),
    ScrollPanelModule,
    RippleModule,
    PanelModule,
    MessageModule,
    ConfirmPopupModule,
    ToastModule
  ],
  exports: [
    HistoricoProcessoComponent,
    HistoricoProcessoFormComponent,
    HistroricoProcessoDetalheComponent,
    HistoricoProcessoExcluirComponent
  ]
})
export class HistoricoProcessoModule { }
