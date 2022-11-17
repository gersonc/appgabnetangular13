import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraficoComponent} from './grafico.component';
import {GraficoRoutingModule} from "./grafico-routing.module";
import {GraficoMenuComponent} from './grafico-menu/grafico-menu.component';
import {GraficoGraficoComponent} from './grafico-grafico/grafico-grafico.component';
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {FocusTrapModule} from "primeng/focustrap";
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";
import {CalendarModule} from "primeng/calendar";
import {RadioButtonModule} from "primeng/radiobutton";
import {ChartModule} from 'primeng-lts/chart';
import { GraficoModalComponent } from './grafico-modal/grafico-modal.component';
import {DialogModule} from "primeng/dialog";


@NgModule({
  declarations: [
    GraficoComponent,
    GraficoMenuComponent,
    GraficoGraficoComponent,
    GraficoModalComponent
  ],
    imports: [
        CommonModule,
        GraficoRoutingModule,
        SidebarModule,
        ScrollPanelModule,
        FocusTrapModule,
        FormsModule,
        DropdownModule,
        CalendarModule,
        RadioButtonModule,
        ChartModule,
        DialogModule
    ],
  exports: [
    GraficoComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]
})

export class GraficoModule {
}
