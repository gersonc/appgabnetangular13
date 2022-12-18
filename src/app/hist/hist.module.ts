import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {CalendarModule} from "primeng/calendar";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import { HistFormComponent } from './hist-form/hist-form.component';
import {UtilModule} from "../util/util.module";
import { HistDatatableComponent } from './hist-datatable/hist-datatable.component';
import {QuillModule} from "ngx-quill";
import {SidebarModule} from "primeng/sidebar";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";
import {QuillViewModule} from "../shared/quill-view/quill-view.module";
import {DialogModule} from "primeng/dialog";
import { HistExcluirComponent } from './hist-excluir/hist-excluir.component';
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ConfirmDialogModule} from "primeng/confirmdialog";



@NgModule({
  declarations: [
    HistFormComponent,
    HistDatatableComponent,
    HistExcluirComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    TooltipModule,
    CalendarModule,
    RippleModule,
    ToastModule,
    UtilModule,
    SidebarModule,
    QuillViewModule,
    DialogModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{'header': 1}, {'header': 2}],               // custom button values
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
          [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
          [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
          [{'header': [1, 2, 3, 4, 5, 6, false]}],
          [{'color': []}, {'background': []}],          // dropdown with defaults from theme
          [{'font': []}],
          [{'align': []}],
          ['clean']
        ]
      }
    }),
  ],
  exports: [
    HistFormComponent,
    HistDatatableComponent,
    HistExcluirComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class HistModule { }
