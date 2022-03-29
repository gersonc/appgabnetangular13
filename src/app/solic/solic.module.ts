import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SolicRoutingModule } from './solic-routing.module';
import { SolicComponent } from './solic.component';
import { SolicMenuListarComponent } from './solic-menu-listar/solic-menu-listar.component';
import { SolicDatatableComponent } from './solic-datatable/solic-datatable.component';
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
import { SolicIncluirComponent } from './solic-incluir/solic-incluir.component';


@NgModule({
  declarations: [
    SolicComponent,
    SolicMenuListarComponent,
    SolicDatatableComponent,
    SolicIncluirComponent
  ],
  imports: [
    CommonModule,
    SolicRoutingModule,
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
  ]
})
export class SolicModule { }
