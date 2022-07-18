import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KillViewComponent } from './kill-view.component';
import {QuillModule} from "ngx-quill";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";



@NgModule({
  declarations: [
    KillViewComponent
  ],
  imports: [
    CommonModule,
    QuillModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    SharedModule
  ],
  exports: [
    KillViewComponent
  ]
})
export class KillViewModule { }
