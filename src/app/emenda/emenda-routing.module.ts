import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmendaListarResolver} from "./_resolvers/emenda-listar.resolver";
import {EmendaDatatableComponent} from "./emenda-datatable/emenda-datatable.component";
import {EmendaComponent} from "./emenda.component";
import {Rule, Scope} from "../_models";
import {AuthChildGuard} from "../_guards";
import {EmendaFormComponent} from "./emenda-form/emenda-form.component";
import {EmendaFormResolver} from "./_resolvers/emenda-form.resolver";
import {EmendaExcluirComponent} from "./emenda-excluir/emenda-excluir.component";
import {EmendaAtualizarComponent} from "./emenda-atualizar/emenda-atualisar.component";
import {EmendaAtualizarResolver} from "./_resolvers/emenda-atualizar.resolver";

const routes: Routes = [
  {
    path: '',
    component: EmendaComponent,
    children: [
      {
        path: '',
        component: EmendaDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_listar
        },
        resolve: {
          dados: EmendaListarResolver
        }
      },
      {
        path: 'listar',
        component: EmendaDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_listar
        },
        resolve: {
          dados: EmendaListarResolver
        }
      },
      {
        path: 'listar2',
        component: EmendaDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_listar
        }
      },
      {
        path: 'incluir',
        component: EmendaFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_incluir
        },
        resolve: {
          dados: EmendaFormResolver
        }
      },
      {
        path: 'alterar',
        component: EmendaFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_alterar
        },
        resolve: {
          dados: EmendaFormResolver
        }
      },
      {
        path: 'apagar',
        component: EmendaExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_apagar
        }
      },
      {
        path: 'atualizar',
        component: EmendaAtualizarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_alterar
        },
        resolve: {
          dados: EmendaAtualizarResolver
        }
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmendaRoutingModule { }
