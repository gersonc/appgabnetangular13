import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { JwtModule } from "@auth0/angular-jwt";
import {HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { WindowsService } from './_layout/_service';
import { LayoutModule } from './_layout/layout.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import { UtilModule } from './util/util.module';
import { HomeComponent } from './home';
/*import { ToastModule } from 'primeng/toast';
import { MessagesModule, } from 'primeng/messages';
import { MessageModule} from 'primeng/message';*/
import { AngularResizeEventModule } from 'angular-resize-event';
import { LoginComponent } from './login';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

import { PanelMenuModule } from 'primeng/panelmenu';
import { NgHttpLoaderModule } from "ng-http-loader";
import { InputSwitchModule } from "primeng/inputswitch";
import {QuillModule} from "ngx-quill";
import {MsgModule} from "./shared/msg/msg.module";
import {ExporterModule} from "./shared/exporter/exporter.module";
import {ErroModule} from "./shared/erro/erro.module";
import {PessoalModule} from "./shared/pessoal/pessoal.module";
import {TesteComponent} from "./teste/teste.component";
import {HttpErrorHandler} from "./http-error-handler.service";
import {OnoffLineModule} from "./shared/onoff-line/onoff-line.module";

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TesteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    AngularResizeEventModule,
    AppRoutingModule,
    UtilModule,
    LayoutModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    PanelMenuModule,
    RippleModule,
    InputSwitchModule,
    FormsModule,
    QuillModule.forRoot(),
    MsgModule,
    ExporterModule,
    ErroModule,
    PessoalModule,
    OnoffLineModule,
    /*ExporterTextoModule,*/
    /*ExporterTextoModule*/
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    HttpErrorHandler,
    MessageService,
    WindowsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
