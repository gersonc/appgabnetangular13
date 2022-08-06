import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AndamentoProposicaoComponent } from './andamento-proposicao.component';
import { AndamentoProposicaoListarComponent } from './andamento-proposicao-listar/andamento-proposicao-listar.component';
import { AndamentoProposicaoFormComponent } from './andamento-proposicao-form/andamento-proposicao-form.component';
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {QuillViewModule} from "../shared/quill-view/quill-view.module";
import {CalendarModule} from "primeng/calendar";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";
import {QuillModule} from "ngx-quill";
import {DialogModule} from "primeng/dialog";
import {InputSwitchModule} from "primeng/inputswitch";
import {ConfigauxModule} from "../configaux/configaux.module";



@NgModule({
  declarations: [
    AndamentoProposicaoComponent,
    AndamentoProposicaoListarComponent,
    AndamentoProposicaoFormComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    RippleModule,
    QuillViewModule,
    CalendarModule,
    PaginatorModule,
    InputTextModule,
    QuillModule,
    DialogModule,
    InputSwitchModule,
    ConfigauxModule
  ],
  exports: [
    AndamentoProposicaoComponent,
    AndamentoProposicaoListarComponent
  ],
})
export class AndamentoProposicaoModule { }
