import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicComponent } from './solic.component';
import {SolicDatatableComponent} from "./solic-datatable/solic-datatable.component";
import {AuthChildGuard} from "../_guards";
import {Rule, Scope} from "../_models";
import {SolicListarResolver} from "./_resolvers/solic-listar.resolver";
import {SolicFormResolver} from "./_resolvers/solic-form.resolver";
import {SolicFormComponent} from "./solic-form/solic-form.component";
import {SolicExcluirComponent} from "./solic-excluir/solic-excluir.component";
import {SolicAnalisarComponent} from "./solic-analisar/solic-analisar.component";

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
      {
        path: 'incluir/cadastro/:modulo',
        component: SolicFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_incluir
        }
      },
      {
        path: 'alterar/cadastro/:modulo',
        component: SolicFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_alterar
        }
      },
      {
        path: 'incluir',
        component: SolicFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_incluir
        },
        resolve: {
          dados: SolicFormResolver
        }
      },
      {
        path: 'alterar',
        component: SolicFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_alterar
        },
        resolve: {
          dados: SolicFormResolver
        }
      },
      {
        path: 'incluir2',
        component: SolicFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_incluir
        }
      },
      {
        path: 'analisar',
        component: SolicAnalisarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_analisar
        }
      },
      {
        path: 'apagar',
        component: SolicExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.solicitacao,
          scopes: Scope.solicitacao_apagar
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
