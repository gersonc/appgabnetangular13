import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import {SolicitacaoSimplesComponent} from "./solicitacao-simples.component";
import {SolicitacaoSimplesAlterarComponent} from "./solicitacao-simples-alterar/solicitacao-simples-alterar.component";
import {SolicitacaoSimplesExcluirComponent} from "./solicitacao-simples-excluir/solicitacao-simples-excluir.component";
import {
  SolicitacaoSimplesCadastroIncluirComponent
} from "./solicitacao-simples-cadastro-incluir/solicitacao-simples-cadastro-incluir.component";
import {
  SolicitacaoSimplesAnalisarComponent
} from "./solicitacao-simples-analisar/solicitacao-simples-analisar.component";
import {SolicitacaoSimplesIncluirComponent} from "./solicitacao-simples-incluir/solicitacao-simples-incluir.component";
import {
  SolicitacaoSimplesDatatableComponent
} from "./solicitacao-simples-datatable/solicitacao-simples-datatable.component";
import {SolicitacaoSimplesAnaliseResolver} from "./_resolvers/solicitacao-simples-analise.resolver";
import {SolicitacaoSimplesAlterarResolver} from "./_resolvers/solicitacao-simples-alterar.resolver";
import {SolicitacaoSimplesCadastroFormResolver} from "./_resolvers/solicitacao-simples-cadastro-form.resolver";
import {SolicitacaoSimplesFormResolver} from "./_resolvers/solicitacao-simples-form.resolver";
import {SolicitacaoSimplesListarResolver} from "./_resolvers/solicitacao-simples-listar.resolver";


const solicitacaoRoutes: Routes = [
  {
    path: '',
    component: SolicitacaoSimplesComponent,
    children: [
      {
        path: '',
        component: SolicitacaoSimplesDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        },
        resolve: {
          dados: SolicitacaoSimplesListarResolver
        }
      },
      {
        path: 'listar',
        // component: SolicitacaoSimplesTesteComponent,
        component: SolicitacaoSimplesDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        },
        resolve: {
          dados: SolicitacaoSimplesListarResolver
        }
      },
      {
        path: 'listar/busca',
        component: SolicitacaoSimplesDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        },
        resolve: {
          dados: SolicitacaoSimplesListarResolver
        }
      },
      {
        path: 'listar2',
        component: SolicitacaoSimplesDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        }
      },
      {
        path: 'cadastro',
        component: SolicitacaoSimplesCadastroIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_incluir
        },
        resolve: {
          dados: SolicitacaoSimplesCadastroFormResolver
        }
      },
      {
        path: 'incluir/cadastro/:modulo',
        component: SolicitacaoSimplesIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_incluir
        }
      },
      {
        path: 'incluir',
        component: SolicitacaoSimplesIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_incluir
        },
        resolve: {
          dados: SolicitacaoSimplesFormResolver
        }
      },
      {
        path: 'incluir2',
        component: SolicitacaoSimplesIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_incluir
        }
      },
      {
        path: 'analisar/:id',
        component: SolicitacaoSimplesAnalisarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_analisar
        },
        resolve: {
          dados: SolicitacaoSimplesAnaliseResolver
        }
      },
      {
        path: 'alterar/:id',
        component: SolicitacaoSimplesAlterarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_alterar
        },
        resolve: {
          dados: SolicitacaoSimplesAlterarResolver
        }
      },
      {
        path: 'apagar',
        component: SolicitacaoSimplesExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_apagar
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(solicitacaoRoutes)],
  exports: [RouterModule]
})
export class SolicitacaoSimplesRoutingModule {
}
