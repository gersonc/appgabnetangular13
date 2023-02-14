import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnoffLineDirective } from './onoff-line.directive';
import { OnoffLineComponent } from "./onoff-line.component";



@NgModule({
  declarations: [
    OnoffLineDirective,
    OnoffLineComponent
  ],
  exports: [
    OnoffLineDirective,
    OnoffLineComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class OnoffLineModule { }
