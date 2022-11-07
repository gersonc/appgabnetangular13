import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';
import { UtilModule } from '../util/util.module';

import { ConfiguracaoComponent } from './configuracao.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ListboxModule } from 'primeng-lts/listbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { ConfiguracaoRoutingModule } from './configuracao-routing.module';
import { ConfiguracaoTabelaComponent } from './configuracao-tabela/configuracao-tabela.component';
import { EtiquetaModule } from '../etiqueta/etiqueta.module';
import { NucleoModule } from '../nucleo/nucleo.module';
import { ConfiguracaoTabela2Component } from './configuracao-tabela2/configuracao-tabela2.component';
import { UsuarioModule } from '../usuario/usuario.module';
import {InputSwitchModule} from "primeng/inputswitch";
import {RippleModule} from "primeng/ripple";




@NgModule({
  declarations: [
    ConfiguracaoComponent,
    ConfiguracaoTabelaComponent,
    ConfiguracaoTabela2Component
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ConfiguracaoRoutingModule,
        UtilModule,
        PanelMenuModule,
        MenuModule,
        InputTextModule,
        ButtonModule,
        MessagesModule,
        MessageModule,
        ToastModule,
        DropdownModule,
        ColorPickerModule,
        TableModule,
        ConfirmDialogModule,
        ListboxModule,
        ScrollPanelModule,
        EtiquetaModule,
        NucleoModule,
        UsuarioModule,
        InputSwitchModule,
        RippleModule,
    ],
  exports: [
    ConfiguracaoComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class ConfiguracaoModule { }
