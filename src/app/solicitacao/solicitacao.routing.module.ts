import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import { SolicitacaoComponent } from './solicitacao.component';
import { SolicitacaoIncluirComponent } from './solicitacao-incluir/solicitacao-incluir.component';
import { SolicitacaoAnalisarComponent } from './solicitacao-analisar/solicitacao-analisar.component';
import { SolicitacaoAnaliseResolver, SolicitacaoFormResolver, SolicitacaoListarResolver } from './_resolvers';
import { SolicitacaoAlterarComponent } from './solicitacao-alterar/solicitacao-alterar.component';
import { SolicitacaoExcluirComponent } from './solicitacao-excluir/solicitacao-excluir.component';
import { SolicitacaoExcluirResolver } from './_resolvers';
import { SolicitacaoDatatableComponent } from './solicitacao-datatable/solicitacao-datatable.component';
import { SolicitacaoListarComponent } from './solicitacao-listar/solicitacao-listar.component';
import { SolicitacaoCadastroIncluirComponent } from './solicitacao-cadastro-incluir/solicitacao-cadastro-incluir.component';
import { SolicitacaoCadastroFormResolver } from './_resolvers/solicitacao-cadastro-form.resolver';
import { SolicitacaoAlterarResolver } from './_resolvers/solicitacao-alterar.resolver';
import {SolicitacaoTesteComponent} from "./solicitacao-teste/solicitacao-teste.component";

const solicitacaoRoutes: Routes = [
  {
    path: '',
    component: SolicitacaoComponent,
    children: [
      {
        path: '',
        component: SolicitacaoDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        },
        resolve: {
          dados: SolicitacaoListarResolver
        }
      },
      {
        path: 'listar',
        // component: SolicitacaoTesteComponent,
        component: SolicitacaoDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        },
        resolve: {
          dados: SolicitacaoListarResolver
        }
      },
      {
        path: 'listar/busca',
        component: SolicitacaoDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        },
        resolve: {
          dados: SolicitacaoListarResolver
        }
      },
      {
        path: 'listar2',
        component: SolicitacaoDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        }
      },
      {
        path: 'cadastro',
        component: SolicitacaoCadastroIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_incluir
        },
        resolve: {
          dados: SolicitacaoCadastroFormResolver
        }
      },
      {
        path: 'incluir/cadastro/:modulo',
        component: SolicitacaoIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_incluir
        }
      },
      {
        path: 'incluir',
        component: SolicitacaoIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_incluir
        },
        resolve: {
          dados: SolicitacaoFormResolver
        }
      },
      {
        path: 'incluir2',
        component: SolicitacaoIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_incluir
        }
      },
      {
        path: 'analisar/:id',
        component: SolicitacaoAnalisarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_analisar
        },
        resolve: {
          dados: SolicitacaoAnaliseResolver
        }
      },
      {
        path: 'alterar/:id',
        component: SolicitacaoAlterarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_alterar
        },
        resolve: {
          dados: SolicitacaoAlterarResolver
        }
      },
      {
        path: 'apagar/:id',
        component: SolicitacaoExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_apagar
        },
        resolve: {
          dados: SolicitacaoExcluirResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(solicitacaoRoutes)],
  exports: [RouterModule]
})
export class SolicitacaoRoutingModule {
}
