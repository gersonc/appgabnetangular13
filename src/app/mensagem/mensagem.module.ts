import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MensagemComponent } from './mensagem/mensagem.component';
import { MensagemFormComponent } from './mensagem-form/mensagem-form.component';
import {DialogModule} from "primeng/dialog";
import {MultiSelectModule} from "primeng/multiselect";
import {InputTextModule} from "primeng/inputtext";
import {UtilModule} from "../util/util.module";
import {QuillModule} from "ngx-quill";
import {ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";
import { MensagemMinilistaComponent } from './mensagem-minilista/mensagem-minilista.component';
import { MensagemMenuComponent } from './mensagem-menu/mensagem-menu.component';
import {SelectButtonModule} from "primeng/selectbutton";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {ChipsModule} from "primeng/chips";
import { MensagemDataviewComponent } from './mensagem-dataview/mensagem-dataview.component';
import {DataViewModule} from "primeng/dataview";
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {MensagemRoutingModule} from "./mensagem-routing.module";
import {QuillViewModule} from "../shared/quill-view/quill-view.module";




@NgModule({
  declarations: [
    MensagemComponent,
    MensagemFormComponent,
    MensagemMinilistaComponent,
    MensagemMenuComponent,
    MensagemDataviewComponent,
  ],
    imports: [
        CommonModule,
        DialogModule,
        MultiSelectModule,
        InputTextModule,
        UtilModule,
        QuillModule,
        ReactiveFormsModule,
        ButtonModule,
        SelectButtonModule,
        CalendarModule,
        DropdownModule,
        ChipsModule,
        DataViewModule,
        SidebarModule,
        ScrollPanelModule,
        MensagemRoutingModule,
        QuillViewModule
    ],
  exports: [
    MensagemFormComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]
})
export class MensagemModule { }
