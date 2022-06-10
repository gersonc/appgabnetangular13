import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillViewComponent } from './quill-view.component';
import {QuillModule} from "ngx-quill";



@NgModule({
  declarations: [
    QuillViewComponent
  ],
  imports: [
    CommonModule,
    QuillModule.forRoot()
  ],
  exports: [
    QuillViewComponent
  ]
})
export class QuillViewModule { }
