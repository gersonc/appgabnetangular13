import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExporterTextoComponent } from './exporter-texto/exporter-texto.component';
import {QuillModule} from "ngx-quill";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    ExporterTextoComponent
  ],
  imports: [
    CommonModule,
    QuillModule,
    DialogModule,
    FormsModule,
    ButtonModule
  ],
  exports: [
    ExporterTextoComponent
  ]
})
export class ExporterModule { }
