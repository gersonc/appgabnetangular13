import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { WindowsService } from './_layout/_service';
import { LayoutModule } from './_layout/layout.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
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
    PanelMenuModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    MessageService,
    WindowsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
