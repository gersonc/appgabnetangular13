import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtInterceptor, ErrorInterceptor } from '../_helpers';

import { ConfigauxIncluirComponent } from './configaux-incluir/configaux-incluir.component';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [ConfigauxIncluirComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    OverlayPanelModule,
    ProgressSpinnerModule
  ],
  entryComponents: [
    ConfigauxIncluirComponent
  ],
  exports: [ConfigauxIncluirComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class ConfigauxModule { }
