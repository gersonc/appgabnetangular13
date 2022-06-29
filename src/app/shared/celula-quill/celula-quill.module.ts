import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelulaQuillComponent } from './celula-quill.component';
import {DialogModule} from "primeng/dialog";
import {QuillViewModule} from "../quill-view/quill-view.module";
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    CelulaQuillComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    QuillViewModule
  ],
  exports: [
    CelulaQuillComponent
  ]
})
export class CelulaQuillModule { }
