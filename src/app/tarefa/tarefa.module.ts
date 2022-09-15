import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HTTP_INTERCEPTORS} from "@angular/common/http";
import { TarefaRoutingModule} from "./tarefa-routing.module";
import { ErrorInterceptor, JwtInterceptor} from "../_helpers";
import { TarefaComponent } from './tarefa.component';
import { TarefaMenuListarComponent } from './tarefa-menu-listar/tarefa-menu-listar.component';
import { TarefaDatatableComponent } from './tarefa-datatable/tarefa-datatable.component';
import { TarefaFormComponent } from './tarefa-form/tarefa-form.component';
import { TarefaDetalheComponent } from './tarefa-detalhe/tarefa-detalhe.component';
import { TarefaAtualizarComponent } from './tarefa-atualizar/tarefa-atualizar.component';
import { SidebarModule} from "primeng/sidebar";
import { ScrollPanelModule} from "primeng/scrollpanel";
import { TarefaUsuarioComponent } from './tarefa-usuario/tarefa-usuario.component';
import { TarefaUsuarioSituacaoComponent } from './tarefa-usuario-situacao/tarefa-usuario-situacao.component';
import { TarefaHistoricoComponent } from './tarefa-historico/tarefa-historico.component';
import { TableModule} from "primeng/table";
import { MenuModule} from "primeng/menu";
import { TooltipModule} from "primeng/tooltip";
import { RippleModule} from "primeng/ripple";
import { ButtonModule} from "primeng/button";
import { ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import { DialogModule} from "primeng/dialog";
import { UtilModule} from "../util/util.module";
import { ContextMenuModule} from "primeng/contextmenu";
import { SelectButtonModule} from "primeng/selectbutton";
import { DropdownModule} from "primeng/dropdown";
import { InputTextModule} from "primeng/inputtext";
import { CalendarModule} from "primeng/calendar";
import {KillViewModule} from "../shared/kill-view/kill-view.module";
import {QuillModule} from "ngx-quill";
import { TarefaUsuarioSituacaoAndamentoComponent } from './tarefa-usuario-situacao-andamento/tarefa-usuario-situacao-andamento.component';
import { TarefaAtualizarFormComponent } from './tarefa-atualizar-form/tarefa-atualizar-form.component';
import {ArquivoModule} from "../arquivo/arquivo.module";
import {ExplorerModule} from "../explorer/explorer.module";
import {ImpressaoModule} from "../shared/impressao/impressao.module";
import { TarefaSituacaoComponent } from './tarefa-situacao/tarefa-situacao.component';


@NgModule({
  declarations: [
    TarefaComponent,
    TarefaMenuListarComponent,
    TarefaDatatableComponent,
    TarefaFormComponent,
    TarefaDetalheComponent,
    TarefaAtualizarComponent,
    TarefaUsuarioComponent,
    TarefaUsuarioSituacaoComponent,
    TarefaHistoricoComponent,
    TarefaUsuarioSituacaoAndamentoComponent,
    TarefaAtualizarFormComponent,
    TarefaSituacaoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TarefaRoutingModule,
    SidebarModule,
    ScrollPanelModule,
    TableModule,
    MenuModule,
    TooltipModule,
    RippleModule,
    ButtonModule,
    ExporterAcessoModule,
    DialogModule,
    UtilModule,
    ContextMenuModule,
    SelectButtonModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    KillViewModule,
    QuillModule,
    FormsModule,
    ArquivoModule,
    ExplorerModule,
    ImpressaoModule
  ],
  exports: [
    TarefaComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]
})
export class TarefaModule { }
