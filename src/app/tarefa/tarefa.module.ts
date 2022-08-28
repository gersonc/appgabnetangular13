import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefaComponent } from './tarefa.component';
import { TarefaMenuListarComponent } from './tarefa-menu-listar/tarefa-menu-listar.component';
import { TarefaDatatableComponent } from './tarefa-datatable/tarefa-datatable.component';
import { TarefaFormComponent } from './tarefa-form/tarefa-form.component';
import { TarefaDetalheComponent } from './tarefa-detalhe/tarefa-detalhe.component';
import { TarefaAtualizarComponent } from './tarefa-atualizar/tarefa-atualizar.component';
import {SidebarModule} from "primeng/sidebar";
import {ScrollPanelModule} from "primeng/scrollpanel";



@NgModule({
  declarations: [
    TarefaComponent,
    TarefaMenuListarComponent,
    TarefaDatatableComponent,
    TarefaFormComponent,
    TarefaDetalheComponent,
    TarefaAtualizarComponent
  ],
  imports: [
    CommonModule,
    SidebarModule,
    ScrollPanelModule
  ]
})
export class TarefaModule { }
