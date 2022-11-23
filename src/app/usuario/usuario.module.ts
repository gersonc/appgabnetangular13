import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { UtilModule } from '../util/util.module';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { UsuarioListarComponent } from './usuario-listar/usuario-listar.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioIncluirComponent } from './usuario-incluir/usuario-incluir.component';
import { UsuarioComponent } from './usuario.component';
import { UsuarioAlterarComponent } from './usuario-alterar/usuario-alterar.component';
import { UsuarioFormUsuarioComponent } from './usuario-form-usuario/usuario-form-usuario.component';
import {PasswordModule} from "primeng/password";
import {InputMaskModule} from "primeng/inputmask";


@NgModule({
  declarations: [UsuarioListarComponent, UsuarioFormComponent, UsuarioIncluirComponent, UsuarioComponent, UsuarioAlterarComponent, UsuarioFormUsuarioComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    UtilModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    ScrollPanelModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    ReactiveFormsModule,
    ToastModule,
    UtilModule,
    PasswordModule,
    InputMaskModule
  ],
  exports: [UsuarioComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class UsuarioModule { }
