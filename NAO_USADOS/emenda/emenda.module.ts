import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { PanelModule } from 'primeng/panel';
import { InplaceModule } from 'primeng/inplace';
import { QuillModule } from 'ngx-quill';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
// import { ExportAsModule } from 'ngx-export-as';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule}  from 'primeng/inputtextarea';
import { EmendaRoutingModule } from './emenda-routing.module';
import { EmendaComponent } from './emenda.component';
import { EmendaDatatableComponent } from './emenda-datatable/emenda-datatable.component';
import { EmendaMenuComponent } from './emenda-menu/emenda-menu.component';
import { EmendaDetalheComponent } from './emenda-detalhe/emenda-detalhe.component';
import { EmendaIncluirComponent } from './emenda-incluir/emenda-incluir.component';
import { EmendaCadastroIncluirComponent } from './emenda-cadastro-incluir/emenda-cadastro-incluir.component';
import { EmendaCadastroIncluirListaexistenteComponent } from './emenda-cadastro-incluir-listaexistente/emenda-cadastro-incluir-listaexistente.component';
import { ConfigauxModule } from "../configaux/configaux.module";
import { EmendaAlterarComponent } from './emenda-alterar/emenda-alterar.component';
import { EmendaAtualizarComponent } from './emenda-atualizar/emenda-atualizar.component';
import { EmendaExcluirComponent } from './emenda-excluir/emenda-excluir.component';
import {InputSwitchModule} from "primeng/inputswitch";
import {RippleModule} from "primeng/ripple";
import {EditorModule} from "primeng/editor";


@NgModule({
  declarations: [
    EmendaComponent,
    EmendaDatatableComponent,
    EmendaMenuComponent,
    EmendaDetalheComponent,
    EmendaIncluirComponent,
    EmendaCadastroIncluirComponent,
    EmendaCadastroIncluirListaexistenteComponent,
    EmendaAlterarComponent,
    EmendaAtualizarComponent,
    EmendaExcluirComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EmendaRoutingModule,
    UtilModule,
    ArquivoModule,
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
    MessagesModule,
    MessageModule,
    PanelModule,
    InplaceModule,
    ToastModule,
    QuillModule.forRoot(),
    CardModule,
    ProgressSpinnerModule,
    InputMaskModule,
    TooltipModule,
    InputTextareaModule,
//    ExportAsModule,
    InputNumberModule,
    ConfigauxModule,
    InputSwitchModule,
    RippleModule,
    EditorModule
  ],
  exports: [
    EmendaComponent
  ],
  entryComponents: [
    EmendaDetalheComponent,
    EmendaAtualizarComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class EmendaModule { }
