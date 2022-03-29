import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicComponent } from './solic.component';
import {SolicDatatableComponent} from "./solic-datatable/solic-datatable.component";
import {AuthChildGuard} from "../_guards";
import {Rule, Scope} from "../_models";
import {SolicListarResolver} from "./_resolvers/solic-listar.resolver";

const routes: Routes = [
  {
    path: '',
    component: SolicComponent,
    children: [
      {
        path: '',
        component: SolicDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        },
        resolve: {
          dados: SolicListarResolver
        }
      },
      {
        path: 'listar',
        component: SolicDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        },
        resolve: {
          dados: SolicListarResolver
        }
      },
      {
        path: 'listar/busca',
        component: SolicDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        },
        resolve: {
          dados: SolicListarResolver
        }
      },
      {
        path: 'listar2',
        component: SolicDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_listar
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicRoutingModule { }
