import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoalComponent } from './pessoal/pessoal.component';
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";



@NgModule({
  declarations: [
    PessoalComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    BadgeModule
  ],
  exports: [
    PessoalComponent
  ]
})
export class PessoalModule { }
