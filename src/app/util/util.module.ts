import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DialogModule} from 'primeng/dialog';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ButtonModule} from 'primeng/button';
import {EditorModule} from 'primeng/editor';
import {CampoControlErroComponent} from './campo-control-erro';
import {ErrorMsgComponent} from './error-msg';
import {FormDebugComponent} from './form-debug';
import {ErrorInterceptor, JwtInterceptor} from '../_helpers';
import {MenuContextoComponent} from './menu-contexto/menu-contexto.component';
import {CampoEditorComponent} from './campo-editor/campo-editor.component';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {CampoErroComponent} from './campo-erro/campo-erro.component';
import {TextoViewComponent} from './texto-view/texto-view.component';
import {QuillModule} from "ngx-quill";
import {SeletorColunasComponent} from './seletor-colunas/seletor-colunas.component';
import {PickListModule} from "primeng/picklist";


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
    QuillModule.forRoot(),
    PickListModule
  ],
  declarations: [
    CampoControlErroComponent,
    FormDebugComponent,
    ErrorMsgComponent,
    MenuContextoComponent,
    CampoEditorComponent,
    CampoErroComponent,
    TextoViewComponent,
    SeletorColunasComponent,
  ],
  exports: [
    FormDebugComponent,
    CampoControlErroComponent,
    ErrorMsgComponent,
    MenuContextoComponent,
    CampoEditorComponent,
    CampoErroComponent,
    TextoViewComponent,
    SeletorColunasComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]
})
export class UtilModule {
}
