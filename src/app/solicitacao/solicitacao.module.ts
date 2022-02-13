import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';

// import { UtilModule } from '../util/util.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { QuillModule } from 'ngx-quill';
import { NgxViacepModule } from '@brunoc/ngx-viacep';
import { AccordionModule } from 'primeng/accordion';

import { ArquivoModule } from '../arquivo/arquivo.module';

// import { SolicitacaoListarComponent } from './solicitacao-listar/solicitacao-listar.component';
import { SolicitacaoIncluirComponent } from './solicitacao-incluir/solicitacao-incluir.component';
import { SolicitacaoDatatableComponent } from './solicitacao-datatable/solicitacao-datatable.component';
import { SolicitacaoMenuListarComponent } from './solicitacao-menu-listar/solicitacao-menu-listar.component';
import { SolicitacaoDetalheComponent } from './solicitacao-detalhe/solicitacao-detalhe.component';
import { SolicitacaoAnalisarComponent } from './solicitacao-analisar/solicitacao-analisar.component';
import { SolicitacaoAlterarComponent } from './solicitacao-alterar/solicitacao-alterar.component';
import { SolicitacaoExcluirComponent } from './solicitacao-excluir/solicitacao-excluir.component';
import { SolicitacaoCadastroIncluirComponent } from './solicitacao-cadastro-incluir/solicitacao-cadastro-incluir.component';
import { SolicitacaoCadastroIncluirListaexistenteComponent } from './solicitacao-cadastro-incluir-listaexistente';
import { RippleModule } from 'primeng/ripple';
import { EditorModule } from "primeng/editor";
import {SolicitacaoRoutingModule} from "./solicitacao.routing.module";
import {SolicitacaoComponent} from "./solicitacao.component";
import {UtilModule} from "../util/util.module";
import {SolicitacaoTesteComponent} from "./solicitacao-teste/solicitacao-teste.component";
import {InputTextareaModule} from "primeng/inputtextarea";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SolicitacaoRoutingModule,
        ArquivoModule,
        UtilModule,
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
        TooltipModule,
//        ExportAsModule,
        NgxViacepModule,
        AccordionModule,
        RippleModule,
        InputTextareaModule,
    ],
  declarations: [
    SolicitacaoComponent,
    // SolicitacaoListarComponent,
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
  exports: [
    SolicitacaoComponent,
    // SolicitacaoListarComponent,
    SolicitacaoIncluirComponent,
    SolicitacaoDatatableComponent,
    SolicitacaoMenuListarComponent,
    SolicitacaoDetalheComponent,
    SolicitacaoAnalisarComponent,
    SolicitacaoAlterarComponent,
    SolicitacaoExcluirComponent
  ],
  entryComponents: [
    SolicitacaoComponent,
    SolicitacaoDetalheComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class SolicitacaoModule { }
