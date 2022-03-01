import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { HistoricoSolicitacaoComponent } from './historico-solocitacao.component';
import { HistoricoSolicitacaoListarComponent } from './historico-solocitacao-listar/historico-solocitacao-listar.component';
import {TableModule} from "primeng/table";
import {QuillModule} from "ngx-quill";
import { HistoricoSolicitacaoFormComponent } from './historico-solocitacao-form/historico-solocitacao-form.component';
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {CalendarModule} from "primeng/calendar";
import {UtilModule} from "../util/util.module";
import {EditorModule} from "primeng/editor";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {RippleModule} from "primeng/ripple";
import {PanelModule} from "primeng/panel";
import {MessageModule} from "primeng/message";
import { HistroricoSolicitacaoDetalheComponent } from './histrorico-solocitacao-detalhe/histrorico-solocitacao-detalhe.component';
import { HistoricoSolicitacaoExcluirComponent } from './historico-solocitacao-excluir/historico-solocitacao-excluir.component';
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ToastModule} from "primeng/toast";
import {ConfirmationService} from "primeng/api";



@NgModule({
  declarations: [
    HistoricoSolicitacaoComponent,
    HistoricoSolicitacaoListarComponent,
    HistoricoSolicitacaoFormComponent,
    HistroricoSolicitacaoDetalheComponent,
    HistoricoSolicitacaoExcluirComponent,
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
    HistoricoSolicitacaoComponent,
    HistoricoSolicitacaoFormComponent,
    HistroricoSolicitacaoDetalheComponent,
    HistoricoSolicitacaoExcluirComponent
  ]
})
export class HistoricoSolicitacaoModule { }
