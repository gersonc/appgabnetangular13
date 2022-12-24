import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PessoalComponent } from './pessoal/pessoal.component';
import {BadgeModule} from "primeng/badge";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AccordionModule} from "primeng/accordion";
import { PessoalMensagemFormComponent } from './pessoal-mensagem-form/pessoal-mensagem-form.component';
import {ButtonModule} from "primeng/button";

import {QuillModule} from "ngx-quill";
import {UtilModule} from "../../util/util.module";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {DialogModule} from "primeng/dialog";
import {QuillViewModule} from "../quill-view/quill-view.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../../_helpers";
import {HttpErrorHandler} from "../../http-error-handler.service";



@NgModule({
  declarations: [
    PessoalComponent,
    PessoalMensagemFormComponent
  ],
  imports: [
    CommonModule,
    BadgeModule,
    OverlayPanelModule,
    AccordionModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    QuillModule,
    UtilModule,
    MultiSelectModule,
    DialogModule,
    QuillViewModule
  ],
  exports: [
    PessoalComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    HttpErrorHandler,
    ]
})
export class PessoalModule { }
