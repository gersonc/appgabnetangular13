import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExplorerRoutingModule} from "./explorer.routing.module";
import {ExplorerComponent} from "./explorer.component";
import {ExplorerListagemComponent} from "./explorer-listagem/explorer-listagem.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AvatarModule} from "primeng/avatar";
import {ExternalLinkDirective} from "./external-link.directive";
import {ButtonModule} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {FormsModule} from "@angular/forms";
import {KeyFilterModule} from "primeng/keyfilter";
import {ArquivoModule} from "../arquivo/arquivo.module";
import {ToastModule} from "primeng/toast";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";


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
    ButtonModule,
    PanelModule,
    InputTextModule,
    RippleModule,
    FormsModule,
    KeyFilterModule,
    ArquivoModule,
    ToastModule,
  ],
  exports: [
    ExplorerComponent,
    ExternalLinkDirective
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class ExplorerModule {
}
