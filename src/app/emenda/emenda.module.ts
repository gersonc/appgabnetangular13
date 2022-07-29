import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmendaRoutingModule } from './emenda-routing.module';
import { EmendaComponent } from './emenda.component';
import { EmendaMenuListarComponent } from './emenda-menu-listar/emenda-menu-listar.component';
import { EmendaDatatableComponent } from './emenda-datatable/emenda-datatable.component';
import { EmendaFormComponent } from './emenda-form/emenda-form.component';
import { EmendaDetalheComponent } from './emenda-detalhe/emenda-detalhe.component';
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ButtonModule} from "primeng/button";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {MenuModule} from "primeng/menu";
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {UtilModule} from "../util/util.module";
import {ContextMenuModule} from "primeng/contextmenu";
import {AutoCompleteModule} from "primeng/autocomplete";
import {InputTextModule} from "primeng/inputtext";
import {ConfigauxModule} from "../configaux/configaux.module";
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {AccordionModule} from "primeng/accordion";
import {QuillModule} from "ngx-quill";
import {ArquivoModule} from "../arquivo/arquivo.module";
import {KillViewModule} from "../shared/kill-view/kill-view.module";
import {ExplorerModule} from "../explorer/explorer.module";
import {ImpressaoModule} from "../shared/impressao/impressao.module";
import {HistModule} from "../hist/hist.module";
import { EmendaExcluirComponent } from './emenda-excluir/emenda-excluir.component';
import { EmendaAtualizarComponent } from './emenda-atualizar/emenda-atualisar.component';


@NgModule({
  declarations: [
    EmendaComponent,
    EmendaMenuListarComponent,
    EmendaDatatableComponent,
    EmendaFormComponent,
    EmendaDetalheComponent,
    EmendaExcluirComponent,
    EmendaAtualizarComponent
  ],
    imports: [
        CommonModule,
        EmendaRoutingModule,
        SidebarModule,
        ScrollPanelModule,
        ButtonModule,
        ReactiveFormsModule,
        DropdownModule,
        TableModule,
        MenuModule,
        ExporterAcessoModule,
        RippleModule,
        TooltipModule,
        DialogModule,
        UtilModule,
        ContextMenuModule,
        AutoCompleteModule,
        InputTextModule,
        ConfigauxModule,
        CalendarModule,
        InputNumberModule,
        AccordionModule,
        QuillModule,
        ArquivoModule,
        KillViewModule,
        ExplorerModule,
        ImpressaoModule,
        HistModule
    ]
})
export class EmendaModule { }
