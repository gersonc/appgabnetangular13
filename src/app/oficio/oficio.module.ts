import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OficioMenuListarComponent } from './oficio-menu-listar/oficio-menu-listar.component';
import { OficioDatatableComponent } from './oficio-datatable/oficio-datatable.component';
import { OficioIncluirComponent } from './oficio-incluir/oficio-incluir.component';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {MenuModule} from "primeng/menu";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import {DialogModule} from "primeng/dialog";
import {UtilModule} from "../util/util.module";
import {ContextMenuModule} from "primeng/contextmenu";
import {OficioRoutingModule} from "./oficio-routing.module";
import {OficioComponent} from "./oficio.component";
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";



@NgModule({
  declarations: [
    OficioComponent,
    OficioMenuListarComponent,
    OficioDatatableComponent,
    OficioIncluirComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    OficioRoutingModule,
    InputTextModule,
    TableModule,
    MenuModule,
    RippleModule,
    TooltipModule,
    ExporterAcessoModule,
    DialogModule,
    UtilModule,
    ContextMenuModule,
    SidebarModule,
    ScrollPanelModule
  ]
})
export class OficioModule { }
