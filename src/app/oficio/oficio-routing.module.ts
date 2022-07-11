import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {Rule, Scope} from "../_models";
import {OficioDatatableComponent} from "./oficio-datatable/oficio-datatable.component";
import {OficioListarResolver} from "./_resolvers/oficio-listar.resolver";
import {OficioComponent} from "./oficio.component";
import {AuthChildGuard} from "../_guards";
import {OficioIncluirComponent} from "./oficio-incluir/oficio-incluir.component";
import {OficioIncluirResolver} from "./_resolvers/oficio-incluir.resolver";

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

