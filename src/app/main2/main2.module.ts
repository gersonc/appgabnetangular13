import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Main2Component } from './main2/main2.component';
import {Main2RoutingModule} from "./main2-routing.module";
import {MensagemModule} from "../mensagem/mensagem.module";



@NgModule({
  declarations: [
    Main2Component
  ],
  imports: [
    CommonModule,
    Main2RoutingModule,
    MensagemModule
  ],
  exports: [
    Main2Component
  ]
})
export class Main2Module { }
