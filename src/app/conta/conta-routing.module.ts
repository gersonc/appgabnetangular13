import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import { ContaComponent } from './conta.component';
import { ContaDatatableComponent } from './conta-datatable/conta-datatable.component';
import {ContaListarResolver} from "./_resolvers/conta-listar.resolver";



const contaRoutes: Routes = [
  {
    path: '',
    component: ContaComponent,
    children: [
      {
        path: '',
        component: ContaDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.contabilidade,
          scopes: Scope.contabilidade_listar
        },
        resolve: {
          dados: ContaListarResolver
        }
      },
      {
        path: 'listar2',
        component: ContaDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.contabilidade,
          scopes: Scope.contabilidade_listar
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(contaRoutes)],
  exports: [RouterModule]
})
export class ContaRoutingModule { }
