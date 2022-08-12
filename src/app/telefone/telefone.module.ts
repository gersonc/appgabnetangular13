import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';
import { TelefoneComponent } from './telefone.component';
import { TelefoneMenuListarComponent } from './telefone-menu-listar/telefone-menu-listar.component';
import { TelefoneDatatableComponent } from './telefone-datatable/telefone-datatable.component';
import { TelefoneFormComponent } from './telefone-form/telefone-form.component';
import {SidebarModule} from "primeng/sidebar";
import {RouterModule} from "@angular/router";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ButtonModule} from "primeng/button";
import {SelectButtonModule} from "primeng/selectbutton";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ChipsModule} from "primeng/chips";
import {TooltipModule} from "primeng/tooltip";
import {UtilModule} from "../util/util.module";
import {QuillModule} from "ngx-quill";
import {TableModule} from "primeng/table";
import {MenuModule} from "primeng/menu";
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";
import {ContextMenuModule} from "primeng/contextmenu";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { TelefoneDetalheComponent } from './telefone-detalhe/telefone-detalhe.component';
import {ImpressaoModule} from "../shared/impressao/impressao.module";
import {KillViewModule} from "../shared/kill-view/kill-view.module";
import {TelefoneRoutingModule} from "./telefone-routing.module";


@NgModule({
  declarations: [
    TelefoneComponent,
    TelefoneMenuListarComponent,
    TelefoneDatatableComponent,
    TelefoneFormComponent,
    TelefoneDetalheComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SidebarModule,
        RouterModule,
        ScrollPanelModule,
        ButtonModule,
        SelectButtonModule,
        CalendarModule,
        DropdownModule,
        AutoCompleteModule,
        ChipsModule,
        TooltipModule,
        UtilModule,
        QuillModule,
        TableModule,
        MenuModule,
        ExporterAcessoModule,
        RippleModule,
        DialogModule,
        ContextMenuModule,
        ConfirmDialogModule,
        ImpressaoModule,
        KillViewModule,
        TelefoneRoutingModule
    ],
  exports: [
    TelefoneComponent,
    TelefoneFormComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class TelefoneModule { }
