import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ErrorInterceptor, JwtInterceptor} from '../_helpers';

import {TableModule} from 'primeng/table';
// import {PaginatorModule} from 'primeng/paginator';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';
// import {OverlayPanelModule} from 'primeng/overlaypanel';
import {DialogModule} from 'primeng/dialog';
// import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import {CalendarModule} from 'primeng/calendar';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputSwitchModule} from 'primeng/inputswitch';
// import {ToastModule} from 'primeng/toast';
import {ListboxModule} from 'primeng/listbox';
import {CheckboxModule} from 'primeng/checkbox';
/*import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
// import {MessagesModule} from 'primeng/messages';
// import {MessageModule} from 'primeng/message';*/
import {MenuModule} from 'primeng/menu';
// import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ContextMenuModule} from 'primeng/contextmenu';
// import {ProgressBarModule} from 'primeng/progressbar';
// import {NgxViacepModule} from '@brunoc/ngx-viacep';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DropdownModule} from 'primeng/dropdown';
import {EtiquetaModule} from '../etiqueta/etiqueta.module';
import {CadastroComponent} from './cadastro.component';
import {CadastroRoutingModule} from './cadastro.routing.module';

import {UtilModule} from '../util/util.module';
import {CadastroDatatableComponent} from './cadastro-datatable';
import {ArquivoModule} from '../arquivo/arquivo.module';
import {RippleModule} from 'primeng/ripple';
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
// import {ChipsModule} from "primeng/chips";
import {CadastroFormComponent} from "./cadastro-form/cadastro-form.component";
import {QuillModule} from "ngx-quill";
import {CadastroMenuListarComponent} from "./cadastro-menu-listar/cadastro-menu-listar.component";
import {KeyFilterModule} from "primeng/keyfilter";
import {
  CadastroIncluirListaexistenteComponent
} from "./cadastro-incluir-listaexistente/cadastro-incluir-listaexistente.component";
import {ConfigauxModule} from "../configaux/configaux.module";
import {CadastroDetalheComponent} from "./cadastro-detalhe/cadastro-detalhe.component";
import {ExplorerModule} from "../explorer/explorer.module";
import {KillViewModule} from "../shared/kill-view/kill-view.module";
import {CadastroExcluirComponent} from "./cadastro-excluir/cadastro-excluir.component";
import {GrafModule} from "../shared/graf/graf.module";
import {ImpressaoModule} from "../shared/impressao/impressao.module";
import {ViacepModule} from "../shared/viacep";
// import {OnoffLineModule} from "../shared/onoff-line/onoff-line.module";


@NgModule({
    imports: [
        ArquivoModule,
        AutoCompleteModule,
        ButtonModule,
        CadastroRoutingModule,
        CalendarModule,
        CheckboxModule,
        // ChipsModule,
        CommonModule,
        ContextMenuModule,
        DialogModule,
        DropdownModule,
        // DynamicDialogModule,
        EtiquetaModule,
        ExporterAcessoModule,
        FormsModule,
        HttpClientModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextareaModule,
        InputTextModule,
        KeyFilterModule,
        ListboxModule,
        MenuModule,
        // MessageModule,
        // MessagesModule,
        ViacepModule,
        // OverlayPanelModule,
        // PaginatorModule,
        PanelModule,
        // ProgressBarModule,
        // ProgressSpinnerModule,
        ReactiveFormsModule,
        RippleModule,
        ScrollPanelModule,
        SidebarModule,
        TableModule,
        // ToastModule,
        TooltipModule,
        // TriStateCheckboxModule,
        UtilModule,
        QuillModule,
        ConfigauxModule,
        ExplorerModule,
        KillViewModule,
        GrafModule,
        ImpressaoModule,
    ],
  declarations: [
    CadastroComponent,
    CadastroDatatableComponent,
    CadastroMenuListarComponent,
    CadastroFormComponent,
    CadastroIncluirListaexistenteComponent,
    CadastroDetalheComponent,
    CadastroExcluirComponent
  ],
  exports: [
    CadastroComponent
  ],
  /*providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]*/
})
export class CadastroModule {
}
