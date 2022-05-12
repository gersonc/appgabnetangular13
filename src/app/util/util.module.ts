import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { CampoControlErroComponent } from './campo-control-erro';
import { ErrorMsgComponent } from './error-msg';
import { FormDebugComponent } from './form-debug';
import { JwtInterceptor, ErrorInterceptor } from '../_helpers';
// import { AutocompleteService, CepService, DropdownService, MostraMenuService } from './_services';
import { ChildLoaderComponent } from './child-loader/child-loader.component';
import { MenuContextoComponent } from './menu-contexto/menu-contexto.component';
import { CampoEditorComponent } from './campo-editor/campo-editor.component';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { CampoErroComponent } from './campo-erro/campo-erro.component';
import { TextoViewComponent } from './texto-view/texto-view.component';
import {QuillModule} from "ngx-quill";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DialogModule,
    ScrollPanelModule,
    ButtonModule,
    EditorModule,
    FormsModule,
    DropdownModule,
    InputTextareaModule,
    MessagesModule,
    MessageModule,
    QuillModule.forRoot()
  ],
  declarations: [
    CampoControlErroComponent,
    FormDebugComponent,
    ErrorMsgComponent,
    ChildLoaderComponent,
    MenuContextoComponent,
    CampoEditorComponent,
    CampoErroComponent,
    TextoViewComponent
  ],
  exports: [
    FormDebugComponent,
    CampoControlErroComponent,
    ErrorMsgComponent,
    ChildLoaderComponent,
    MenuContextoComponent,
    CampoEditorComponent,
    CampoErroComponent,
    TextoViewComponent
  ],
  providers: [
    /*DropdownService,
    CepService,
    AutocompleteService,
    MostraMenuService,*/
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class UtilModule { }
