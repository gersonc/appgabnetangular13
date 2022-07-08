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
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { InplaceModule } from 'primeng/inplace';
import { QuillModule } from 'ngx-quill';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
// import { ExportAsModule } from 'ngx-export-as';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { OficioIncluirComponent } from './oficio-incluir/oficio-incluir.component';
import { OficioRoutingModule } from './oficio.routing.module';
import { OficioMenuListarComponent } from './oficio-menu-listar/oficio-menu-listar.component';
import { OficioDatatableComponent } from './oficio-datatable/oficio-datatable.component';
import { OficioDetalheComponent } from './oficio-detalhe/oficio-detalhe.component';
import { OficioAlterarComponent } from './oficio-alterar/oficio-alterar.component';
import { OficioAnalisarComponent } from './oficio-analisar/oficio-analisar.component';
import { OficioExcluirComponent } from './oficio-excluir/oficio-excluir.component';
import { OficioComponent } from './oficio.component';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { EditorModule } from 'primeng/editor';
import {AccordionModule} from 'primeng/accordion';
import {InputNumberModule} from 'primeng/inputnumber';
// import {QuillViewModule} from "../shared/quill-view/quill-view.module";
// import {DetalheQuillModule} from "../shared/detalhe-quill/detalhe-quill.module";
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";



@NgModule({
  declarations: [
    OficioComponent,
    OficioIncluirComponent,
    OficioMenuListarComponent,
    OficioDatatableComponent,
    OficioDetalheComponent,
    OficioAlterarComponent,
    OficioAnalisarComponent,
    OficioExcluirComponent
  ],
  exports: [
    OficioComponent,
    OficioIncluirComponent,
    OficioMenuListarComponent,
    OficioDatatableComponent,
    OficioDetalheComponent,
    OficioAlterarComponent,
    OficioAnalisarComponent,
    OficioExcluirComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        OficioRoutingModule,
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
        InputSwitchModule,
        MessagesModule,
        MessageModule,
        PanelModule,
        InplaceModule,
        ToastModule,
        QuillModule.forRoot(),
        CardModule,
        ProgressSpinnerModule,
        InputMaskModule,
//         ExportAsModule,
        TooltipModule,
        RippleModule,
        EditorModule,
        AccordionModule,
        InputNumberModule,
        // QuillViewModule,
        // DetalheQuillModule,
        ExporterAcessoModule
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class OficioModule { }
