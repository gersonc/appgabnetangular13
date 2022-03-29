import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';
import { HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

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

import {SolicitacaoIncluirComponent} from "./solicitacao-incluir/solicitacao-incluir.component";
import {SolicitacaoDatatableComponent} from "./solicitacao-datatable/solicitacao-datatable.component";
import {SolicitacaoMenuListarComponent} from "./solicitacao-menu-listar/solicitacao-menu-listar.component";
import {SolicitacaoDetalheComponent} from "./solicitacao-detalhe/solicitacao-detalhe.component";
import {SolicitacaoAnalisarComponent} from "./solicitacao-analisar/solicitacao-analisar.component";
import {SolicitacaoAlterarComponent} from "./solicitacao-alterar/solicitacao-alterar.component";
import {SolicitacaoExcluirComponent} from "./solicitacao-excluir/solicitacao-excluir.component";
import {SolicitacaoCadastroIncluirComponent } from "./solicitacao-cadastro-incluir/solicitacao-cadastro-incluir.component";
import {SolicitacaoCadastroIncluirListaexistenteComponent} from "./solicitacao-cadastro-incluir-listaexistente";
import {SolicitacaoTesteComponent} from "./solicitacao-teste/solicitacao-teste.component";

import { SolicitacaoT2RoutingModule } from './solicitacao-t2-routing.module';
import { SolicitacaoT2Component } from './solicitacao-t2.component';

@NgModule({
  declarations: [
    SolicitacaoT2Component,

    SolicitacaoIncluirComponent,
    SolicitacaoDatatableComponent,
    SolicitacaoMenuListarComponent,
    SolicitacaoDetalheComponent,
    SolicitacaoAnalisarComponent,
    SolicitacaoAlterarComponent,
    SolicitacaoExcluirComponent,
    SolicitacaoCadastroIncluirComponent,
    SolicitacaoCadastroIncluirListaexistenteComponent,
    SolicitacaoTesteComponent
  ],
  imports: [
    CommonModule,
    SolicitacaoT2RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

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
    SolicitacaoT2Component,
  ],
  entryComponents: [
    SolicitacaoT2Component,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class SolicitacaoT2Module { }
