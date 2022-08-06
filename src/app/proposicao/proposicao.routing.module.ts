import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';

import { ProposicaoComponent } from './proposicao.component';
import { ProposicaoDatatableComponent } from './proposicao-datatable/proposicao-datatable.component';
import {ProposicaoListarResolver} from "./_resolvers/proposicao-listar.resolver";
import {ProposicaoFormComponent} from "./proposicao-form/proposicao-form.component";
import {ProposicaoFormResolver} from "./_resolvers/proposicao-form.resolver";
import {ProposicaoExcluirComponent} from "./proposicao-excluir/proposicao-excluir.component";


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
        path: 'listar2',
        component: ProposicaoDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_listar
        }
      },
      {
        path: 'incluir',
        component: ProposicaoFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_incluir
        },
        resolve: {
          dados: ProposicaoFormResolver
        }
      },
      {
        path: 'incluir2',
        component: ProposicaoFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_incluir
        }
      },
      {
        path: 'alterar',
        component: ProposicaoFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_alterar
        },
        resolve: {
          dados: ProposicaoFormResolver
        }
      },
      {
        path: 'apagar',
        component: ProposicaoExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_apagar
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(proposicaoRoutes)],
  exports: [RouterModule]
})
export class ProposicaoRoutingModule {
}
