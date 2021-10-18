import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenuComponent, JanelaDirective, MenuInferiorComponent } from './menu';
import { RodapeComponent } from './rodape/rodape.component';
import { PanelmenuComponent } from './panelmenu/panelmenu.component';
import { PanelMenuModule } from 'primeng/panelmenu';


@NgModule({
  declarations: [
    MenuComponent,
    JanelaDirective,
    MenuInferiorComponent,
    RodapeComponent,
    PanelmenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    SlideMenuModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    PanelMenuModule
  ],
  exports: [
    MenuComponent,
    JanelaDirective,
    MenuInferiorComponent,
    RodapeComponent,
    PanelmenuComponent

  ]

})
export class LayoutModule { }
