import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraficosComponent } from './graficos/graficos.component';
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {RadioButtonModule} from "primeng/radiobutton";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";
import {GraficosRoutingModule} from "./graficos-routing.module";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";



@NgModule({
  declarations: [
    GraficosComponent
  ],
  imports: [
    CommonModule,
    GraficosRoutingModule,
    SidebarModule,
    ScrollPanelModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    FormsModule,
    RippleModule,
    TooltipModule
  ],
  exports: [
    GraficosComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]
})
export class GraficosModule { }
