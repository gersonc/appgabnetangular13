import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TableModule} from "primeng/table";
import {InputMaskModule} from "primeng/inputmask";
import {ButtonModule} from "primeng/button";
import {SidebarModule} from "primeng/sidebar";
import {AutoCompleteModule} from "primeng/autocomplete";
import {PaginatorModule} from "primeng/paginator";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import {DynamicDialogModule} from "primeng/dynamicdialog";
import {InputTextModule} from "primeng/inputtext";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {CalendarModule} from "primeng/calendar";
import {MenuModule} from "primeng/menu";
import {ListboxModule} from "primeng/listbox";
import {ContextMenuModule} from "primeng/contextmenu";
import {InputSwitchModule} from "primeng/inputswitch";
import {MessagesModule} from "primeng/messages";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {MessageModule} from "primeng/message";
import {PanelModule} from "primeng/panel";
import {InplaceModule} from "primeng/inplace";
import {ToastModule} from "primeng/toast";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {EditorModule} from "primeng/editor";
import {QuillModule} from "ngx-quill";
import {TooltipModule} from "primeng/tooltip";
import {NgxViacepModule} from "@brunoc/ngx-viacep";
import {AccordionModule} from "primeng/accordion";
import {RippleModule} from "primeng/ripple";
import {InputTextareaModule} from "primeng/inputtextarea";

import {ArquivoModule} from "../arquivo/arquivo.module";
import {UtilModule} from "../util/util.module";
import {HistoricoSolicitacaoModule} from "../historico-solicitacao/historico-solicitacao.module";
import { SolicitacaoSimplesComponent } from './solicitacao-simples.component';
import { SolicitacaoSimplesMenuListarComponent } from './solicitacao-simples-menu-listar/solicitacao-simples-menu-listar.component';
import { SolicitacaoSimplesDatatableComponent } from './solicitacao-simples-datatable/solicitacao-simples-datatable.component';
import { SolicitacaoSimplesAlterarComponent } from './solicitacao-simples-alterar/solicitacao-simples-alterar.component';
import { SolicitacaoSimplesAnalisarComponent } from './solicitacao-simples-analisar/solicitacao-simples-analisar.component';
import { SolicitacaoSimplesCadastroIncluirComponent } from './solicitacao-simples-cadastro-incluir/solicitacao-simples-cadastro-incluir.component';
import { SolicitacaoSimplesCadastroIncluirListaexistenteComponent } from './solicitacao-simples-cadastro-incluir-listaexistente/solicitacao-simples-cadastro-incluir-listaexistente.component';
import { SolicitacaoSimplesDetalheComponent } from './solicitacao-simples-detalhe/solicitacao-simples-detalhe.component';
import { SolicitacaoSimplesExcluirComponent } from './solicitacao-simples-excluir/solicitacao-simples-excluir.component';
import { SolicitacaoSimplesIncluirComponent } from './solicitacao-simples-incluir/solicitacao-simples-incluir.component';
import {SolicitacaoSimplesRoutingModule} from "./solicitacao-simples.routing.module";




@NgModule({
  declarations: [
    SolicitacaoSimplesComponent,
    SolicitacaoSimplesMenuListarComponent,
    SolicitacaoSimplesDatatableComponent,
    SolicitacaoSimplesAlterarComponent,
    SolicitacaoSimplesAnalisarComponent,
    SolicitacaoSimplesCadastroIncluirComponent,
    SolicitacaoSimplesCadastroIncluirListaexistenteComponent,
    SolicitacaoSimplesDetalheComponent,
    SolicitacaoSimplesExcluirComponent,
    SolicitacaoSimplesIncluirComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SolicitacaoSimplesRoutingModule,

    TableModule,
    InputMaskModule,
    ButtonModule,
    SidebarModule,
    AutoCompleteModule,
    PaginatorModule,
    DropdownModule,
    DialogModule,
    DynamicDialogModule,
    InputTextModule,
    ScrollPanelModule,
    CalendarModule,
    MenuModule,
    ListboxModule,
    ContextMenuModule,
    InputSwitchModule,
    MessagesModule,
    ProgressSpinnerModule,
    MessageModule,
    PanelModule,
    InplaceModule,
    ToastModule,
    OverlayPanelModule,
    EditorModule,
    QuillModule.forRoot(),
    TooltipModule, // ExportAsModule,
    NgxViacepModule,
    AccordionModule,
    RippleModule,
    InputTextareaModule,
    //        ExportAsModule,
    ArquivoModule,
    UtilModule,
    HistoricoSolicitacaoModule,
  ],
  exports: [
    SolicitacaoSimplesComponent,
    SolicitacaoSimplesMenuListarComponent,
    SolicitacaoSimplesDatatableComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]



})
export class SolicitacaoSimplesModule { }
