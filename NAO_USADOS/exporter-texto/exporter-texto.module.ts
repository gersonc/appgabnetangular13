import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExporterTextoComponent } from './exporter-texto.component';
import {QuillModule} from "ngx-quill";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
/*import { ExporterDetalheComponent } from './exporter-detalhe/exporter-detalhe.component';*/


@NgModule({
  declarations: [
    ExporterTextoComponent,
    /*ExporterDetalheComponent*/
  ],
    imports: [
        CommonModule,
        QuillModule.forRoot(),
        FormsModule,
        ButtonModule,
        DialogModule
    ],
  exports: [
    ExporterTextoComponent,
    /*ExporterDetalheComponent*/
  ]
})
export class ExporterTextoModule { }
