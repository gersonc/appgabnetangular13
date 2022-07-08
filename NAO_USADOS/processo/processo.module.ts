import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';

import { UtilModule } from '../util/util.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
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
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
// import { ExportAsModule } from 'ngx-export-as';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ProcessoListarComponent } from './processo-listar/processo-listar.component';
import { ProcessoMenuListarComponent } from './processo-menu-listar/processo-menu-listar.component';
import { ProcessoDatatableComponent } from './processo-datatable/processo-datatable.component';
import { ProcessoDetalheComponent } from './processo-detalhe/processo-detalhe.component';
import { ProcessoExcluirComponent } from './processo-excluir/processo-excluir.component';
import { ProcessoAnalisarComponent } from './processo-analisar/processo-analisar.component';
import { ProcessoRoutingModule } from './processo.routing.module';
import { ProcessoOficioTableComponent } from './processo-oficio-table/processo-oficio-table.component';
import { ProcessoHistoricoTableComponent } from './processo-historico-table/processo-historico-table.component';
import {RippleModule} from 'primeng/ripple';
import {TooltipModule} from 'primeng/tooltip';
import {EditorModule} from 'primeng/editor';
import {QuillModule} from "ngx-quill";
import {HistoricoProcessoModule} from "../historico-processo/historico-processo.module";


@NgModule({
  declarations: [
    ProcessoListarComponent,
    ProcessoMenuListarComponent,
    ProcessoDatatableComponent,
    ProcessoDetalheComponent,
    ProcessoExcluirComponent,
    ProcessoAnalisarComponent,
    ProcessoOficioTableComponent,
    ProcessoHistoricoTableComponent
  ],
  exports: [
    ProcessoListarComponent,
    ProcessoMenuListarComponent,
    ProcessoDatatableComponent,
    ProcessoDetalheComponent,
    ProcessoExcluirComponent,
    ProcessoAnalisarComponent,
    ProcessoOficioTableComponent,
    ProcessoHistoricoTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UtilModule,
    TableModule,
    ButtonModule,
    SidebarModule,
    PaginatorModule,
    DropdownModule,
    DialogModule,
    OverlayPanelModule,
    DynamicDialogModule,
    InputTextModule,
    ScrollPanelModule,
    MenuModule,
    ListboxModule,
    ContextMenuModule,
    InputSwitchModule,
    MessagesModule,
    MessageModule,
    PanelModule,
    InplaceModule,
    ToastModule,
    CardModule,
    ProgressSpinnerModule,
    InputMaskModule,
    ProcessoRoutingModule,
    RippleModule,
    TooltipModule,
    EditorModule,
    QuillModule,
    HistoricoProcessoModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class ProcessoModule { }
