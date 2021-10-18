import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import { ProcessoListarComponent} from './processo-listar/processo-listar.component';
import { ProcessoUtilResolver, ProcessoListarResolver} from './_resolvers';
import { ProcessoAnalisarComponent } from './processo-analisar/processo-analisar.component';
import { ProcessoDetalheComponent } from './processo-detalhe/processo-detalhe.component';
import { ProcessoExcluirComponent } from './processo-excluir/processo-excluir.component';


const processoRoutes: Routes = [
  {
    path: 'listar',
    component: ProcessoListarComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.processo,
      scopes: Scope.processo_listar
    },
    resolve: {
      dados: ProcessoListarResolver
    }
  },
  {
    path: 'listar/busca',
    component: ProcessoListarComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.processo,
      scopes: Scope.processo_listar
    },
    resolve: {
      dados: ProcessoListarResolver
    }
  },
  {
    path: 'analisar/:id',
    component: ProcessoAnalisarComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.processo,
      scopes: [Scope.processo_deferir, Scope.processo_indeferir]
    },
    resolve: {
      dados: ProcessoUtilResolver
    }
  },
  {
    path: 'excluir/:id',
    component: ProcessoExcluirComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.processo,
      scopes: Scope.processo_apagar
    },
    resolve: {
      dados: ProcessoUtilResolver
    }
  },
  {
    path: 'detalhe',
    component: ProcessoDetalheComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.processo,
      scopes: Scope.processo_listar
    }
  },
  {
    path: 'listar2',
    component: ProcessoListarComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.processo,
      scopes: Scope.processo_listar
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(processoRoutes)],
  exports: [RouterModule]
})
export class ProcessoRoutingModule {
}
