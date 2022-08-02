import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorInterceptor, JwtInterceptor} from '../_helpers';

import {ProposicaoComponent} from './proposicao.component';
import {ProposicaoMenuListarComponent} from './proposicao-menu-listar/proposicao-menu-listar.component';
import {ProposicaoDatatableComponent} from './proposicao-datatable/proposicao-datatable.component';
import {ProposicaoRoutingModule} from './proposicao.routing.module';

import {RippleModule} from "primeng/ripple";
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {MenuModule} from "primeng/menu";
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {UtilModule} from "../util/util.module";
import {ContextMenuModule} from "primeng/contextmenu";
import {ProposicaoDetalheComponent} from "./proposicao-detalhe/proposicao-detalhe.component";
import {ImpressaoModule} from "../shared/impressao/impressao.module";
import {KillViewModule} from "../shared/kill-view/kill-view.module";
import {ExplorerModule} from "../explorer/explorer.module";
import {QuillModule} from "ngx-quill";
import {ProposicaoFormComponent} from "./proposicao-form/proposicao-form.component";
import {ConfigauxModule} from "../configaux/configaux.module";
import {CalendarModule} from "primeng/calendar";
import {ArquivoModule} from "../arquivo/arquivo.module";
import {AccordionModule} from "primeng/accordion";

@NgModule({
  declarations: [
    ProposicaoComponent,
    ProposicaoMenuListarComponent,
    ProposicaoDatatableComponent,
    ProposicaoDetalheComponent,
    ProposicaoFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProposicaoRoutingModule,
    RippleModule,
    SidebarModule,
    ScrollPanelModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    MenuModule,
    ExporterAcessoModule,
    TooltipModule,
    DialogModule,
    UtilModule,
    ContextMenuModule,
    ImpressaoModule,
    KillViewModule,
    ExplorerModule,
    QuillModule,
    ConfigauxModule,
    CalendarModule,
    ArquivoModule,
    AccordionModule,
  ],
  exports: [
    ProposicaoComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ]
})
export class ProposicaoModule {
}
