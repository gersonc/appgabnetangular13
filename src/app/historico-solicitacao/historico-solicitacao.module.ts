import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {TableModule} from "primeng/table";
import {QuillModule} from "ngx-quill";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {CalendarModule} from "primeng/calendar";
import {UtilModule} from "../util/util.module";
import {EditorModule} from "primeng/editor";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {RippleModule} from "primeng/ripple";
import {PanelModule} from "primeng/panel";
import {MessageModule} from "primeng/message";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ToastModule} from "primeng/toast";
import {HistoricoSolicitacaoFormComponent} from "./historico-solicitacao-form/historico-solicitacao-form.component";
import {
  HistroricoSolicitacaoDetalheComponent
} from "./histrorico-solicitacao-detalhe/histrorico-solicitacao-detalhe.component";
import {
  HistoricoSolicitacaoExcluirComponent
} from "./historico-solicitacao-excluir/historico-solicitacao-excluir.component";
import {
  HistoricoSolicitacaoListarComponent
} from "./historico-solicitacao-listar/historico-solicitacao-listar.component";
import {HistoricoSolicitacaoComponent} from "./historico-solicitacao.component";


@NgModule({
  declarations: [
    HistoricoSolicitacaoComponent,
    HistoricoSolicitacaoListarComponent,
    HistoricoSolicitacaoFormComponent,
    HistroricoSolicitacaoDetalheComponent,
    HistoricoSolicitacaoExcluirComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
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
    HistoricoSolicitacaoListarComponent,
    HistroricoSolicitacaoDetalheComponent,
    HistoricoSolicitacaoExcluirComponent
  ]
})
export class HistoricoSolicitacaoModule {
}
