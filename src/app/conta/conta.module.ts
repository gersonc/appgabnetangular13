import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';

import { UtilModule } from '../util/util.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { ChipsModule } from 'primeng/chips';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';

import { ArquivoModule } from '../arquivo/arquivo.module';
import { ContaRoutingModule } from './conta-routing.module';
import { ContaComponent } from './conta.component';
import { ContaMenuListarComponent } from './conta-menu-listar/conta-menu-listar.component';
import { ContaDatatableComponent } from './conta-datatable/conta-datatable.component';
import { ContaFormularioComponent } from './conta-formulario/conta-formulario.component';
import {RippleModule} from "primeng/ripple";
import {QuillModule} from "ngx-quill";
import { ContaDetalheComponent } from './conta-detalhe/conta-detalhe.component';
import { ContaFormComponent } from './conta-form/conta-form.component';
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import {ExplorerModule} from "../explorer/explorer.module";



@NgModule({
  declarations: [
    ContaComponent,
    ContaMenuListarComponent,
    ContaDatatableComponent,
    ContaFormularioComponent,
    ContaDetalheComponent,
    ContaFormComponent,
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
    InputSwitchModule,
    ProgressSpinnerModule,
    ChipsModule,
    ContextMenuModule,
    TooltipModule,
    SelectButtonModule,
    ToastModule,
    KeyFilterModule,
    ConfirmDialogModule,
    InputTextareaModule,
    RadioButtonModule,
    ContaRoutingModule,
    ArquivoModule,
    RippleModule,
    QuillModule,
    ExporterAcessoModule,
    ExplorerModule
  ],
  exports: [
    ContaComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ConfirmationService
  ]
})
export class ContaModule { }
