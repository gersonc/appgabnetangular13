import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ProceComponent} from './proce.component';
import {ProceMenuListarComponent} from './proce-menu-listar/proce-menu-listar.component';
import {ProceDatatableComponent} from './proce-datatable/proce-datatable.component';
import {ProceDetalheComponent} from './proce-detalhe/proce-detalhe.component';
import {ProceAnalisarComponent} from './proce-analisar/proce-analisar.component';
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ButtonModule} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {MenuModule} from "primeng/menu";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {ListboxModule} from "primeng/listbox";
import {ContextMenuModule} from "primeng/contextmenu";
import {ToastModule} from "primeng/toast";
import {QuillModule} from "ngx-quill";
import {InputTextModule} from "primeng/inputtext";
import {ArquivoModule} from "../arquivo/arquivo.module";
import {ExplorerModule} from "../explorer/explorer.module";
import {UtilModule} from "../util/util.module";
import {AutoCompleteModule} from "primeng/autocomplete";
import {CalendarModule} from "primeng/calendar";
import {InputSwitchModule} from "primeng/inputswitch";
import {AccordionModule} from "primeng/accordion";
import {ProceRoutingModule} from "./proce-routing.module";
import {HistModule} from "../hist/hist.module";
import {QuillViewModule} from "../shared/quill-view/quill-view.module";
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import {ImpressaoModule} from "../shared/impressao/impressao.module";
import {SelectButtonModule} from "primeng/selectbutton";
import {ProceExcluirComponent} from './proce-excluir/proce-excluir.component';
import {FocusTrapModule} from "primeng/focustrap";


@NgModule({
  declarations: [
    ProceComponent,
    ProceMenuListarComponent,
    ProceDatatableComponent,
    ProceDetalheComponent,
    ProceAnalisarComponent,
    ProceExcluirComponent
  ],
  imports: [
    CommonModule,
    ProceRoutingModule,
    SidebarModule,
    ScrollPanelModule,
    ButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    TableModule,
    MenuModule,
    RippleModule,
    TooltipModule,
    DialogModule,
    ListboxModule,
    ContextMenuModule,
    ToastModule,
    QuillModule,
    FormsModule,
    InputTextModule,
    ArquivoModule,
    ExplorerModule,
    UtilModule,
    AutoCompleteModule,
    CalendarModule,
    InputSwitchModule,
    AccordionModule,
    FocusTrapModule,
    UtilModule,
    HistModule,
    QuillViewModule,
    ExporterAcessoModule,
    ImpressaoModule,
    SelectButtonModule,
  ],
  exports: [
    ProceComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]
})
export class ProceModule {
}
