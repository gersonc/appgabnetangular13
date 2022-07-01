import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalheQuillComponent } from './detalhe-quill.component';
import {DialogModule} from "primeng/dialog";
import {QuillModule} from "ngx-quill";
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    DetalheQuillComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    QuillModule,
    ButtonModule
  ],
  exports: [
    DetalheQuillComponent
  ]
})
export class DetalheQuillModule { }
