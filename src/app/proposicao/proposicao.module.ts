import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';

import { ArquivoModule } from '../arquivo/arquivo.module';
import { UtilModule } from '../util/util.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
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
import { QuillModule } from 'ngx-quill';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { FieldsetModule } from 'primeng/fieldset';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
// import { ExportAsModule } from 'ngx-export-as';
import { EditorModule } from 'primeng/editor';


import { ConfigauxModule } from '../configaux/configaux.module';
import { ProposicaoComponent } from './proposicao.component';
import { ProposicaoMenuListarComponent } from './proposicao-menu-listar/proposicao-menu-listar.component';
import { ProposicaoDatatableComponent } from './proposicao-datatable/proposicao-datatable.component';
import { ProposicaoDetalheComponent } from './proposicao-detalhe/proposicao-detalhe.component';
import { ProposicaoRoutingModule } from './proposicao.routing.module';
import { ProposicaoIncluirComponent } from './proposicao-incluir/proposicao-incluir.component';
import { ProposicaoAlterarComponent } from './proposicao-alterar/proposicao-alterar.component';
import { ProposicaoExcluirComponent } from './proposicao-excluir/proposicao-excluir.component';
import { AndamentoproposicaoIncluirComponent } from './andamentoproposicao-incluir/andamentoproposicao-incluir.component';
import { AndamentoproposicaoListarEditarExcluirComponent } from './andamentoproposicao-listar-editar-excluir/andamentoproposicao-listar-editar-excluir.component';
import {RippleModule} from "primeng/ripple";

@NgModule({
  declarations: [
    ProposicaoComponent,
    ProposicaoMenuListarComponent,
    ProposicaoDatatableComponent,
    ProposicaoDetalheComponent,
    ProposicaoIncluirComponent,
    ProposicaoAlterarComponent,
    ProposicaoExcluirComponent,
    AndamentoproposicaoIncluirComponent,
    AndamentoproposicaoListarEditarExcluirComponent
  ],
  exports: [
    ProposicaoComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        UtilModule,
        ArquivoModule,
        ConfigauxModule,
        TableModule,
        ButtonModule,
        SidebarModule,
        AutoCompleteModule,
        PaginatorModule,
        DropdownModule,
        DialogModule,
        OverlayPanelModule,
        DynamicDialogModule,
        InputTextModule,
        ScrollPanelModule,
        CalendarModule,
        MenuModule,
        ListboxModule,
        ContextMenuModule,
        InputSwitchModule,
        MessagesModule,
        MessageModule,
        PanelModule,
        InplaceModule,
        ToastModule,
        EditorModule,
        QuillModule.forRoot(),
        CardModule,
        ProgressSpinnerModule,
        InputMaskModule,
        ConfirmDialogModule,
        FieldsetModule,
        TooltipModule,
//        ExportAsModule,
        ProposicaoRoutingModule,
        RippleModule
    ],
  entryComponents: [
    ProposicaoDetalheComponent,
    AndamentoproposicaoIncluirComponent,
    AndamentoproposicaoListarEditarExcluirComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ConfirmationService,
  ]
})
export class ProposicaoModule { }
