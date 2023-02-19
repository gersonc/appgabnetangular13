import {ArquivoModule} from '../arquivo/arquivo.module';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ButtonModule} from 'primeng/button';
import {CadastroComponent} from './cadastro.component';
import {CadastroDatatableComponent} from './cadastro-datatable';
import {CadastroDetalheComponent} from "./cadastro-detalhe/cadastro-detalhe.component";
import {CadastroExcluirComponent} from "./cadastro-excluir/cadastro-excluir.component";
import {CadastroFormComponent} from "./cadastro-form/cadastro-form.component";
import {CadastroIncluirListaexistenteComponent} from "./cadastro-incluir-listaexistente/cadastro-incluir-listaexistente.component";
import {CadastroMenuListarComponent} from "./cadastro-menu-listar/cadastro-menu-listar.component";
import {CadastroRoutingModule} from './cadastro.routing.module';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {CommonModule} from '@angular/common';
import {ConfigauxModule} from "../configaux/configaux.module";
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {EtiquetaModule} from '../etiqueta/etiqueta.module';
import {ExplorerModule} from "../explorer/explorer.module";
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GrafModule} from "../shared/graf/graf.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ImpressaoModule} from "../shared/impressao/impressao.module";
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {KeyFilterModule} from "primeng/keyfilter";
import {KillViewModule} from "../shared/kill-view/kill-view.module";
import {ListboxModule} from 'primeng/listbox';
import {MenuModule} from 'primeng/menu';
import {NgModule} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {QuillModule} from "ngx-quill";
import {RippleModule} from 'primeng/ripple';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {SidebarModule} from 'primeng/sidebar';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {UtilModule} from '../util/util.module';

@NgModule({
    imports: [
        ArquivoModule,
        AutoCompleteModule,
        ButtonModule,
        CadastroRoutingModule,
        CalendarModule,
        CheckboxModule,
        CommonModule,
        ConfigauxModule,
        ContextMenuModule,
        DialogModule,
        DropdownModule,
        EtiquetaModule,
        ExplorerModule,
        ExporterAcessoModule,
        FormsModule,
        GrafModule,
        HttpClientModule,
        ImpressaoModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KeyFilterModule,
        KillViewModule,
        ListboxModule,
        MenuModule,
        PanelModule,
        QuillModule,
        ReactiveFormsModule,
        RippleModule,
        ScrollPanelModule,
        SidebarModule,
        TableModule,
        TooltipModule,
        UtilModule,
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
