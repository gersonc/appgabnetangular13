import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorInterceptor, JwtInterceptor } from "../_helpers";

import { ChartModule } from 'primeng/chart';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from "primeng/menu";
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

import { GraficosComponent } from './graficos.component';
import { GraficosCadastroComponent } from './graficos-cadastro/graficos-cadastro.component';
import { GraficosRoutingModule } from "./graficos-routing.module";
import { GraficosSolicitacaoComponent } from './graficos-solicitacao/graficos-solicitacao.component';
import { GraficosOficioComponent } from './graficos-oficio/graficos-oficio.component';
import { GraficosProcessoComponent } from './graficos-processo/graficos-processo.component';
import { GraficosEmendaComponent } from './graficos-emenda/graficos-emenda.component';





@NgModule({
  declarations: [
    GraficosComponent,
    GraficosCadastroComponent,
    GraficosSolicitacaoComponent,
    GraficosOficioComponent,
    GraficosProcessoComponent,
    GraficosEmendaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    GraficosRoutingModule,
    ChartModule,
    RadioButtonModule,
    PanelModule,
    CardModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    PanelMenuModule,
    MenuModule,

  ],
  exports: [
    GraficosComponent,
    GraficosCadastroComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class GraficosModule { }
