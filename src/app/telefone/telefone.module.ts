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


import { TelefoneRoutingModule } from './telefone-routing.module';
import { TelefoneComponent } from './telefone.component';
import { TelefoneMenuListarComponent } from './telefone-menu-listar/telefone-menu-listar.component';
import { TelefoneDatatableComponent } from './telefone-datatable/telefone-datatable.component';
import { TelefoneFormularioComponent } from './telefone-formulario/telefone-formulario.component';


@NgModule({
  declarations: [
    TelefoneComponent,
    TelefoneMenuListarComponent,
    TelefoneDatatableComponent,
    TelefoneFormularioComponent,
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
    TelefoneRoutingModule
  ],
  exports: [
    TelefoneComponent
  ],
  entryComponents: [
    TelefoneFormularioComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ConfirmationService
  ]
})
export class TelefoneModule { }
