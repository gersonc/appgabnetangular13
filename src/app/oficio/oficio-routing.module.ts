import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {Rule, Scope} from "../_models";
import {OficioDatatableComponent} from "./oficio-datatable/oficio-datatable.component";
import {OficioListarResolver} from "./_resolvers/oficio-listar.resolver";
import {OficioComponent} from "./oficio.component";
import {AuthChildGuard} from "../_guards";
import {OficioIncluirComponent} from "./oficio-incluir/oficio-incluir.component";
import {OficioIncluirResolver} from "./_resolvers/oficio-incluir.resolver";
import {OficioAlterarComponent} from "./oficio-alterar/oficio-alterar.component";
import {OficioFormResolver} from "./_resolvers/oficio-form.resolver";
import {OficioExcluirComponent} from "./oficio-excluir/oficio-excluir.component";
import {OficioAnalisarComponent} from "./oficio-analisar/oficio-analisar.component";

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
      {
        path: 'alterar',
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
        path: 'apagar',
        component: OficioExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: Scope.oficio_apagar
        }
      },
      {
        path: 'analisar',
        component: OficioAnalisarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.oficio,
          scopes: [Scope.oficio_deferir, Scope.oficio_indeferir]
        }
      },



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

