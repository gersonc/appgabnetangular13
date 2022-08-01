import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';

import { ProposicaoComponent } from './proposicao.component';
import { ProposicaoDatatableComponent } from './proposicao-datatable/proposicao-datatable.component';
import {ProposicaoListarResolver} from "./_resolvers/proposicao-listar.resolver";


const proposicaoRoutes: Routes = [
  {
    path: '',
    component: ProposicaoComponent,
    children: [
      {
        path: '',
        component: ProposicaoDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_listar
        },
        resolve: {
          dados: ProposicaoListarResolver
        }
      },
      {
        path: 'listar',
        component: ProposicaoDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_listar
        },
        resolve: {
          dados: ProposicaoListarResolver
        }
      },
      {
        path: 'listar/busca',
        component: ProposicaoDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_listar
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(proposicaoRoutes)],
  exports: [RouterModule]
})
export class ProposicaoRoutingModule {
}
