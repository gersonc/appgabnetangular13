import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmendaListarResolver} from "./_resolvers/emenda-listar.resolver";
import {EmendaDatatableComponent} from "./emenda-datatable/emenda-datatable.component";
import {EmendaComponent} from "./emenda.component";
import {Rule, Scope} from "../_models";
import {AuthChildGuard} from "../_guards";
import {EmendaFormComponent} from "./emenda-form/emenda-form.component";
import {EmendaFormResolver} from "./_resolvers/emenda-form.resolver";

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
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmendaRoutingModule { }
