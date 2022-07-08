import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampoExtendidoComponent } from './campo-extendido.component';
import {DialogModule} from "primeng/dialog";
import {QuillViewModule} from "../quill-view/quill-view.module";
import {ButtonModule} from "primeng/button";
import {EmailTelefoneCelularModule} from "../email-telefone-celular/email-telefone-celular.module";
// import {ExporterTextoModule} from "../exporter-texto/exporter-texto.module";


@NgModule({
  declarations: [
    CampoExtendidoComponent
  ],
    imports: [
        CommonModule,
        DialogModule,
        QuillViewModule,
        ButtonModule,
        EmailTelefoneCelularModule,
        /*ExporterTextoModule*/
    ],
  exports: [
    CampoExtendidoComponent
  ]
})
export class CampoExtendidoModule { }
