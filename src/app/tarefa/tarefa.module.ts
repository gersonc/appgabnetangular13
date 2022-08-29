import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import { TarefaComponent } from './tarefa.component';
import { TarefaMenuListarComponent } from './tarefa-menu-listar/tarefa-menu-listar.component';
import { TarefaDatatableComponent } from './tarefa-datatable/tarefa-datatable.component';
import { TarefaFormComponent } from './tarefa-form/tarefa-form.component';
import { TarefaDetalheComponent } from './tarefa-detalhe/tarefa-detalhe.component';
import { TarefaAtualizarComponent } from './tarefa-atualizar/tarefa-atualizar.component';
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import { TarefaUsuarioComponent } from './tarefa-usuario/tarefa-usuario.component';
import { TarefaUsuarioSituacaoComponent } from './tarefa-usuario-situacao/tarefa-usuario-situacao.component';
import { TarefaHistoricoComponent } from './tarefa-historico/tarefa-historico.component';
import {TableModule} from "primeng/table";
import {MenuModule} from "primeng/menu";
import {TooltipModule} from "primeng/tooltip";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import {DialogModule} from "primeng/dialog";
import {UtilModule} from "../util/util.module";
import {ContextMenuModule} from "primeng/contextmenu";
import {SelectButtonModule} from "primeng/selectbutton";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {TarefaRoutingModule} from "./tarefa-routing.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";



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
    TarefaHistoricoComponent
  ],
  imports: [
    CommonModule,
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
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule
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
