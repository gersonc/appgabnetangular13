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
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { EtiquetaSeletorComponent } from './etiqueta-seletor';
import { EtiquetaConfigComponent } from './etiqueta-config/etiqueta-config.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { EtiquetaFormComponent } from './etiqueta-form/etiqueta-form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EtiquetaPrintComponent } from './etiqueta-print/etiqueta-print.component';
import { EtiquetaCelulaComponent } from './etiqueta-celula/etiqueta-celula.component';
import {CardModule} from "primeng/card";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ConfirmPopupModule} from "primeng/confirmpopup";
// import {ProgressSpinnerModule } from "primeng";

@NgModule({
  declarations: [EtiquetaSeletorComponent, EtiquetaConfigComponent, EtiquetaFormComponent, EtiquetaPrintComponent, EtiquetaCelulaComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        UtilModule,
        DropdownModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        ToastModule,
        DialogModule,
        ProgressSpinnerModule,
        ConfirmDialogModule,
        CardModule,
        ScrollPanelModule,
        ConfirmPopupModule
    ],
    exports: [
        EtiquetaConfigComponent,
        EtiquetaSeletorComponent,
        EtiquetaPrintComponent,
      EtiquetaCelulaComponent
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class EtiquetaModule { }
