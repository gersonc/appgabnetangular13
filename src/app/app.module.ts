import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { WindowsService } from './_layout/_service';
import { LayoutModule } from './_layout/layout.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import {JwtInterceptor, ErrorInterceptor, ResponseInterceptor} from './_helpers';
import { UtilModule } from './util/util.module';
import { HomeComponent } from './home';
import { ToastModule } from 'primeng/toast';
import { MessagesModule, } from 'primeng/messages';
import { MessageModule} from 'primeng/message';
import { AngularResizeEventModule } from 'angular-resize-event';
import { LoginComponent } from './login';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

import { PanelMenuModule } from 'primeng/panelmenu';
import { NgHttpLoaderModule } from "ng-http-loader";
import { InputSwitchModule } from "primeng/inputswitch";
import {QuillModule} from "ngx-quill";

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["gn5.dv","192.168.0.10","localhost:4300", "localhost:4300", "slimgn08.dv", "gn5.gabnet.com.br", "viacep.com.br", "gbnt05raiz.s3.sa-east-1.amazonaws.com"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    NgHttpLoaderModule.forRoot(),
    AngularResizeEventModule,
    ToastModule,
    MessagesModule,
    MessageModule,
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
    QuillModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    /*{ provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },*/
    MessageService,
    WindowsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
