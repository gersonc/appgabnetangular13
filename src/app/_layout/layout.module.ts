import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { PanelmenuComponent } from './panelmenu/panelmenu.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MainConfigComponent } from "./main-config/main-config.component";
import { AppInputStyleSwitchComponent } from "./input-styles-switch/app.inputstyleswitch.module";
import { InputSwitchModule } from "primeng/inputswitch";
import { ButtonModule } from "primeng/button";
import { TemaTopoBotaoComponent } from './tema-topo-botao/tema-topo-botao.component';
import { MainTopoComponent } from './main-topo/main-topo.component';
import { PessoalModule } from "../shared/pessoal/pessoal.module";


@NgModule({
  declarations: [
    PanelmenuComponent,
    MainConfigComponent,
    AppInputStyleSwitchComponent,
    TemaTopoBotaoComponent,
    MainTopoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PanelMenuModule,
    RadioButtonModule,
    InputSwitchModule,
    ButtonModule,
    PessoalModule
  ],
  exports: [
    PanelmenuComponent,
    MainTopoComponent
  ]

})
export class LayoutModule { }
