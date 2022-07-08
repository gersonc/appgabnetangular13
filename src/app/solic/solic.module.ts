import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {SolicRoutingModule} from './solic-routing.module';
import {SolicComponent} from './solic.component';
import {SolicMenuListarComponent} from './solic-menu-listar/solic-menu-listar.component';
import {SolicDatatableComponent} from './solic-datatable/solic-datatable.component';
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ButtonModule} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {MenuModule} from "primeng/menu";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {ListboxModule} from "primeng/listbox";
import {ContextMenuModule} from "primeng/contextmenu";
// import {ToastModule} from "primeng/toast";
import {QuillModule} from "ngx-quill";
import {InputTextModule} from "primeng/inputtext";
// import {SolicIncluirComponent} from './solic-incluir/solic-incluir.component';
import {SolicDetalheComponent} from './solic-detalhe/solic-detalhe.component';
import {ArquivoModule} from "../arquivo/arquivo.module";
import {ExplorerModule} from "../explorer/explorer.module";
import {UtilModule} from "../util/util.module";
import {AutoCompleteModule} from "primeng/autocomplete";
import {CalendarModule} from "primeng/calendar";
import {InputSwitchModule} from "primeng/inputswitch";
import {AccordionModule} from "primeng/accordion";
// import {EditorModule} from "primeng/editor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "../_helpers";
import {SolicFormComponent} from './solic-form/solic-form.component';
import {SolicExcluirComponent} from './solic-excluir/solic-excluir.component';
import {SolicAnalisarComponent} from './solic-analisar/solic-analisar.component';
import {CardModule} from "primeng/card";
import {HistModule} from "../hist/hist.module";
// import {QuillViewModule} from "../shared/quill-view/quill-view.module";
// import {CampoExtendidoModule} from "../shared/campo-extendido/campo-extendido.module";
/*import {CelulaQuillModule} from "../shared/celula-quill/celula-quill.module";*/
import {ImpressaoModule} from "../shared/impressao/impressao.module";
import {OverlayPanelModule} from "primeng/overlaypanel";
/*import {CelulaModule} from "../shared/celula/celula.module";*/
/*import {ExporterTextoModule} from "../shared/exporter-texto/exporter-texto.module";*/
import {ExporterAcessoModule} from "../shared/exporter-acesso/exporter-acesso.module";


@NgModule({
  declarations: [
    SolicComponent,
    SolicMenuListarComponent,
    SolicDatatableComponent,
    // SolicIncluirComponent,
    SolicDetalheComponent,
    SolicFormComponent,
    SolicExcluirComponent,
    SolicAnalisarComponent,
  ],
    imports: [
        CommonModule,
        SolicRoutingModule,
        SidebarModule,
        ScrollPanelModule,
        ButtonModule,
        ReactiveFormsModule,
        DropdownModule,
        TableModule,
        MenuModule,
        RippleModule,
        TooltipModule,
        DialogModule,
        ListboxModule,
        ContextMenuModule,
        // ToastModule,
        QuillModule.forRoot({
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],
                    [{'header': 1}, {'header': 2}],               // custom button values
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],
                    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                    [{'font': []}],
                    [{'align': []}],
                    ['clean']
                ]
            }
        }),
        FormsModule,
        InputTextModule,
        ArquivoModule,
        ExplorerModule,
        UtilModule,
        AutoCompleteModule,
        CalendarModule,
        InputSwitchModule,
        AccordionModule,
        // EditorModule,
        UtilModule,
        CardModule,
        HistModule,
        // QuillViewModule,
        /*CampoExtendidoModule,*/
        /*CelulaQuillModule,*/
        ImpressaoModule,
        OverlayPanelModule,
        /*CelulaModule,*/
        /*ExporterTextoModule,*/
        ExporterAcessoModule
    ],
  exports: [
    SolicComponent,
    // SolicIncluirComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ]
})
export class SolicModule {
}
