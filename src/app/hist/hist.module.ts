import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {CalendarModule} from "primeng/calendar";
import {EditorModule} from "primeng/editor";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import { HistFormComponent } from './hist-form/hist-form.component';
import {UtilModule} from "../util/util.module";
import { HistDatatableComponent } from './hist-datatable/hist-datatable.component';
import {QuillModule} from "ngx-quill";
import {SidebarModule} from "primeng/sidebar";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";



@NgModule({
  declarations: [
    HistFormComponent,
    HistDatatableComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TableModule,
        TooltipModule,
        CalendarModule,
        EditorModule,
        RippleModule,
        ToastModule,
        UtilModule,
        QuillModule,
        SidebarModule
    ],
  exports: [
    HistFormComponent,
    HistDatatableComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class HistModule { }
