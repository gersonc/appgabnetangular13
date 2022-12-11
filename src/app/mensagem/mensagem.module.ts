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




@NgModule({
  declarations: [
    MensagemComponent,
    MensagemFormComponent,
    MensagemMinilistaComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    MultiSelectModule,
    InputTextModule,
    UtilModule,
    QuillModule,
    ReactiveFormsModule,
    ButtonModule
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
