import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthChildGuard} from "../_guards";
import {Rule, Scope} from "../_models";
import {ProceComponent} from "./proce.component";
import {ProceDatatableComponent} from "./proce-datatable/proce-datatable.component";
import {ProceListarResolver} from "./_resolvers/proce-listar.resolver";
import {ProceAnalisarComponent} from "./proce-analisar/proce-analisar.component";





const routes: Routes = [
  {
    path: '',
    component: ProceComponent,
    children: [
      {
        path: '',
        component: ProceDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.processo,
          scopes: Scope.processo_listar
        },
        resolve: {
          dados: ProceListarResolver
        }
      },
      {
        path: 'listar',
        component: ProceDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.processo,
          scopes: Scope.processo_listar
        },
        resolve: {
          dados: ProceListarResolver
        }
      },
      {
        path: 'listar2',
        component: ProceDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.processo,
          scopes: Scope.processo_listar
        }
      },
      {
        path: 'analisar',
        component: ProceAnalisarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.processo,
          scopes: [Scope.processo_deferir, Scope.processo_indeferir, Scope.usuario_principal, Scope.usuario_responsavel]
        }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProceRoutingModule { }
