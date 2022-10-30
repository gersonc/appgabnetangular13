import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownColoridoComponent } from './dropdown-colorido.component';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DropdownColoridoComponent,
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  exports: [
    DropdownColoridoComponent
  ]
})
export class DropdownColoridoModule { }
