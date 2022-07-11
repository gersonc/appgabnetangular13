import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';

import { OficioComponent } from './oficio.component';
import { OficioDatatableComponent } from './oficio-datatable/oficio-datatable.component';
import { OficioIncluirComponent} from './oficio-incluir/oficio-incluir.component';
import { OficioDetalheComponent } from './oficio-detalhe/oficio-detalhe.component';
import { OficioAlterarComponent } from './oficio-alterar/oficio-alterar.component';
import { OficioAnalisarComponent } from './oficio-analisar/oficio-analisar.component';
import { OficioExcluirComponent } from './oficio-excluir/oficio-excluir.component';
import {
  OficioAnalisarResolver, OficioIncluirResolver,
  OficioDetalheResolver, OficioListarResolver,
  OficioFormResolver
} from './_resolvers';


const oficioRoutes: Routes = [
  {
    path: '',
    component: OficioComponent,
    children: [
      {
        path: '',
        component: OficioDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_listar
        },
        resolve: {
          dados: OficioListarResolver
        }
      },
      {
        path: 'listar',
        component: OficioDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_listar
        },
        resolve: {
          dados: OficioListarResolver
        }
      },
      {
        path: 'listar/busca',
        component: OficioDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_listar
        },
        resolve: {
          dados: OficioListarResolver
        }
      },
      {
        path: 'listar2',
        component: OficioDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_listar
        }
      },
      {
        path: 'detalhe/:id',
        component: OficioDetalheComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_listar
        },
        resolve: {
          dados: OficioDetalheResolver
        }
      },
      {
        path: 'alterar/:id',
        component: OficioAlterarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_alterar
        },
        resolve: {
          dados: OficioFormResolver
        }
      },
      {
        path: 'incluir',
        component: OficioIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_incluir
        },
        resolve: {
          dados: OficioIncluirResolver
        }
      },
      /*{
        path: 'processo',
        component: OficioIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_incluir
        },
        resolve: {
          dados: OficioIncluirResolver
        }
      },
      {
        path: 'solicitacao',
        component: OficioIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_incluir
        },
        resolve: {
          dados: OficioIncluirResolver
        }
      },*/
      {
        path: 'analisar/:id',
        component: OficioAnalisarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: [Scope.oficio_indeferir, Scope.oficio_deferir, Scope.usuario_principal, Scope.usuario_responsavel]
        },
        resolve: {
          dados: OficioAnalisarResolver
        }
      },
      {
        path: 'apagar/:id',
        component: OficioExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_apagar
        },
        resolve: {
          dados: OficioAnalisarResolver
        }
      }
    ]
  },
  {
    path: 'processo',
    component: OficioIncluirComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.oficio,
      scopes: Scope.oficio_incluir
    },
    resolve: {
      dados: OficioIncluirResolver
    }
  },
  {
    path: 'solicitacao',
    component: OficioIncluirComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.oficio,
      scopes: Scope.oficio_incluir
    },
    resolve: {
      dados: OficioIncluirResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(oficioRoutes)],
  exports: [RouterModule]
})
export class OficioRoutingModule {
}
