import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelulaComponent } from './celula.component';
import { DetalhePdfComponent } from './detalhe-pdf/detalhe-pdf.component';



@NgModule({
  declarations: [
    CelulaComponent,
    DetalhePdfComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CelulaComponent
  ]
})
export class CelulaModule { }
