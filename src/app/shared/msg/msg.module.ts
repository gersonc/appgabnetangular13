import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsgComponent } from './msg.component';
import {ToastModule} from "primeng/toast";
import {MessagesModule} from "primeng/messages";
import {MessageModule} from "primeng/message";



@NgModule({
  declarations: [
    MsgComponent
  ],
  imports: [
    CommonModule,
    ToastModule,
    MessagesModule,
    MessageModule,
  ],
  exports: [
    MsgComponent
  ]
})
export class MsgModule { }
