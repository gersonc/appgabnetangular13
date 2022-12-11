import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoalComponent } from './pessoal/pessoal.component';
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AccordionModule} from "primeng/accordion";



@NgModule({
  declarations: [
    PessoalComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    BadgeModule,
    OverlayPanelModule,
    AccordionModule
  ],
  exports: [
    PessoalComponent
  ]
})
export class PessoalModule { }
