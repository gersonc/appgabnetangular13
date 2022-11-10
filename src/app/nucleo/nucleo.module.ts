import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';
import { FormsModule } from '@angular/forms';

import { UtilModule } from '../util/util.module';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';

import { NucleoConfigComponent } from './nucleo-config/nucleo-config.component';
import { NucleoFormComponent } from './nucleo-form/nucleo-form.component';
import {ConfirmPopupModule} from "primeng/confirmpopup";



@NgModule({
  declarations: [NucleoConfigComponent, NucleoFormComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        UtilModule,
        TableModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ConfirmPopupModule
    ],
  exports: [
    NucleoConfigComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class NucleoModule { }
