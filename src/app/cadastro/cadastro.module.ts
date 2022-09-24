import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor, ErrorInterceptor } from '../_helpers';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelModule} from 'primeng/panel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgxViacepModule } from '@brunoc/ngx-viacep';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { EtiquetaModule } from '../etiqueta/etiqueta.module';
import { CadastroComponent } from './cadastro.component';
import { CadastroRoutingModule } from './cadastro.routing.module';

import { UtilModule } from '../util/util.module';
import { CadastroDatatableComponent } from './cadastro-datatable';
import { CadastroMenuListarComponent } from './cadastro-menu-listar';
import { ArquivoModule } from '../arquivo/arquivo.module';
import { RippleModule } from 'primeng/ripple';
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CadastroRoutingModule,
    UtilModule,
    TableModule,
    OverlayPanelModule,
    DialogModule,
    DynamicDialogModule,
    PanelModule,
    ButtonModule,
    SidebarModule,
    AutoCompleteModule,
    PaginatorModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule,
    CalendarModule,
    InputSwitchModule,
    InputTextareaModule,
    ToastModule,
    TooltipModule,
    ListboxModule,
    CheckboxModule,
    TriStateCheckboxModule,
    ScrollPanelModule,
    ProgressSpinnerModule,
    MenuModule,
    ContextMenuModule,
    MessagesModule,
    MessageModule,
    NgxViacepModule,
    EtiquetaModule,
    ArquivoModule,
    ProgressBarModule,
    RippleModule,
    ExporterAcessoModule,
  ],
  declarations: [
    CadastroComponent,
    CadastroDatatableComponent,
    CadastroMenuListarComponent,
  ],
  exports: [
    CadastroComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class CadastroModule {}
