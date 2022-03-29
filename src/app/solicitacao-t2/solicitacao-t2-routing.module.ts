import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitacaoT2Component } from './solicitacao-t2.component';
import {SolicitacaoDatatableComponent} from "./solicitacao-datatable/solicitacao-datatable.component";
import {AuthChildGuard} from "../_guards";
import {Rule, Scope} from "../_models";
import {
  SolicitacaoAnaliseResolver,
  SolicitacaoFormResolver,
  SolicitacaoListarResolver
} from "./_resolvers";
import {
  SolicitacaoCadastroIncluirComponent
} from "./solicitacao-cadastro-incluir/solicitacao-cadastro-incluir.component";
import {SolicitacaoCadastroFormResolver} from "./_resolvers/solicitacao-cadastro-form.resolver";
import {SolicitacaoIncluirComponent} from "./solicitacao-incluir/solicitacao-incluir.component";
import {SolicitacaoAnalisarComponent} from "./solicitacao-analisar/solicitacao-analisar.component";
import {SolicitacaoAlterarComponent} from "./solicitacao-alterar/solicitacao-alterar.component";
import {SolicitacaoAlterarResolver} from "./_resolvers/solicitacao-alterar.resolver";
import {SolicitacaoExcluirComponent} from "./solicitacao-excluir/solicitacao-excluir.component";

const routes: Routes = [
  {
    path: '',
    component: SolicitacaoT2Component,
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
    path: 'apagar',
    component: SolicitacaoExcluirComponent,
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoT2RoutingModule { }
