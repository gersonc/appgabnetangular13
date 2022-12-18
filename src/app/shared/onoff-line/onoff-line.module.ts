import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnoffLineDirective } from './onoff-line.directive';



@NgModule({
  declarations: [
    OnoffLineDirective
  ],
  exports: [
    OnoffLineDirective
  ],
  imports: [
    CommonModule
  ]
})
export class OnoffLineModule { }
