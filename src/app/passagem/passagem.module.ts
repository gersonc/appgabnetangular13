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
// import { AutoCompleteModule } from 'primeng/autocomplete';
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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';

import { ArquivoModule } from '../arquivo/arquivo.module';
import { PassagemComponent } from './passagem.component';
import { PassagemMenuListarComponent } from './passagem-menu-listar/passagem-menu-listar.component';
import { PassagemDatatableComponent } from './passagem-datatable/passagem-datatable.component';
import { PassagemRoutingModule } from './passagem-routing.module';
import { PassagemFormularioComponent } from './passagem-formulario/passagem-formulario.component';

import {AutoCompleteModule} from 'primeng/autocomplete';


@NgModule({
  declarations: [
    PassagemComponent,
    PassagemMenuListarComponent,
    PassagemDatatableComponent,
    PassagemFormularioComponent
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
    ContextMenuModule,
    TooltipModule,
    SelectButtonModule,
    ToastModule,
    KeyFilterModule,
    ConfirmDialogModule,
    InputTextareaModule,
    RadioButtonModule,
    PassagemRoutingModule,
    ArquivoModule
  ],
  exports: [
    PassagemComponent
  ],
  entryComponents: [
    PassagemFormularioComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ConfirmationService
  ]
})
export class PassagemModule { }
