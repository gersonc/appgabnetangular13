import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TarefaComponent } from './tarefa.component';
import { TarefaDatatableComponent } from './tarefa-datatable/tarefa-datatable.component';
import { TarefaListarResolver } from './_resolvers';


const tarefaRoutes: Routes = [
  {
    path: '',
    component: TarefaComponent,
    children: [
      {
        path: '',
        component: TarefaDatatableComponent,
        resolve: {
          dados: TarefaListarResolver
        }
      },
      {
        path: 'listar2',
        component: TarefaDatatableComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(tarefaRoutes)],
  exports: [RouterModule]
})
export class TarefaRoutingModule { }
