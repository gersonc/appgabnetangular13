import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampoExtendidoComponent } from './campo-extendido.component';
import {DialogModule} from "primeng/dialog";
import {QuillViewModule} from "../quill-view/quill-view.module";
import {ButtonModule} from "primeng/button";
import {EmailTelefoneCelularModule} from "../email-telefone-celular/email-telefone-celular.module";


@NgModule({
  declarations: [
    CampoExtendidoComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    QuillViewModule,
    ButtonModule,
    EmailTelefoneCelularModule
  ],
  exports: [
    CampoExtendidoComponent
  ]
})
export class CampoExtendidoModule { }
