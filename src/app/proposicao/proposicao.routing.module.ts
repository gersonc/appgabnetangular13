import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';

import { ProposicaoListarResolver, ProposicaoFormResolver, ProposicaoDetalheExcluirResolver } from './_resolvers';
import { ProposicaoComponent } from './proposicao.component';
import { ProposicaoDatatableComponent } from './proposicao-datatable/proposicao-datatable.component';
import { ProposicaoDetalheComponent } from './proposicao-detalhe/proposicao-detalhe.component';
import { ProposicaoIncluirComponent } from './proposicao-incluir/proposicao-incluir.component';
import { ProposicaoAlterarComponent } from './proposicao-alterar/proposicao-alterar.component';
import { ProposicaoExcluirComponent } from './proposicao-excluir/proposicao-excluir.component';


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
      {
        path: 'detalhe/:id',
        component: ProposicaoDetalheComponent,
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
        path: 'incluir',
        component: ProposicaoIncluirComponent,
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
        component: ProposicaoIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_incluir
        }
      },
      {
        path: 'alterar/:id',
        component: ProposicaoAlterarComponent,
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
        path: 'apagar/:id',
        component: ProposicaoExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.proposicao,
          scopes: Scope.proposicao_apagar
        },
        resolve: {
          dados: ProposicaoDetalheExcluirResolver
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
