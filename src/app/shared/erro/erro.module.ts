import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErroComponent } from './erro/erro.component';
import {DialogModule} from "primeng/dialog";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../../_helpers";



@NgModule({
    declarations: [
        ErroComponent
    ],
    exports: [
        ErroComponent
    ],
    imports: [
        CommonModule,
        DialogModule
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]
})
export class ErroModule { }
