import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
import { PanelmenuComponent } from './panelmenu/panelmenu.component';
import { PanelMenuModule } from 'primeng/panelmenu';


@NgModule({
  declarations: [
    PanelmenuComponent,
  ],
  imports: [
    CommonModule,
    // RouterModule,
    PanelMenuModule
  ],
  exports: [
    PanelmenuComponent
  ]

})
export class LayoutModule { }
