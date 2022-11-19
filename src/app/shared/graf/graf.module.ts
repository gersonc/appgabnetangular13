import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GrafComponent} from './graf/graf.component';
import {RadioButtonModule} from "primeng/radiobutton";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {TooltipModule} from "primeng/tooltip";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../../_helpers";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";


@NgModule({
  declarations: [
    GrafComponent
  ],
  imports: [
    CommonModule,
    RadioButtonModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    TooltipModule,
    ProgressSpinnerModule,
    ButtonModule,
    RippleModule
  ],
  exports: [
    GrafComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]
})
export class GrafModule {
}
