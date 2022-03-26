import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExplorerRoutingModule} from "./explorer.routing.module";
import {ExplorerComponent} from "./explorer.component";
import {ExplorerListagemComponent} from "./explorer-listagem/explorer-listagem.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AvatarModule} from "primeng/avatar";
import {ExternalLinkDirective} from "./external-link.directive";
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {FormsModule} from "@angular/forms";
import {KeyFilterModule} from "primeng/keyfilter";
import {ArquivoModule} from "../arquivo/arquivo.module";
import {ToastModule} from "primeng/toast";
// import {FileUploadModule} from "primeng/fileupload";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";
import {ContextMenuModule} from "primeng/contextmenu";


@NgModule({
  declarations: [
    ExplorerComponent,
    ExplorerListagemComponent,
    ExternalLinkDirective
  ],
  imports: [
    CommonModule,
    ExplorerRoutingModule,
    OverlayPanelModule,
    AvatarModule,
    DialogModule,
    ButtonModule,
    PanelModule,
    InputTextModule,
    RippleModule,
    FormsModule,
    KeyFilterModule,
    ArquivoModule,
    ToastModule,
    ContextMenuModule,
    // FileUploadModule,
  ],
  exports: [
    ExplorerComponent,
    ExternalLinkDirective
  ]
})
export class ExplorerModule {
}
