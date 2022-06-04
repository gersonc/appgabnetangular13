import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AautoPdfComponent } from './aauto-pdf.component';
import { AautoPdfService } from "./aauto-pdf.service";
import {EditorModule} from "primeng/editor";
import {QuillModule} from "ngx-quill";



@NgModule({
  declarations: [
    AautoPdfComponent
  ],
  imports: [
    CommonModule,
    EditorModule,
    QuillModule,
  ],
  exports: [
    AautoPdfComponent
  ],
  providers: [
    AautoPdfService
  ],
})
export class AautoPdfModule { }
