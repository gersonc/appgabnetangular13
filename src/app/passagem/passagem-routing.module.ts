import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import { PassagemComponent } from './passagem.component';
import { PassagemDatatableComponent } from './passagem-datatable/passagem-datatable.component';
import { PassagemListarResolver } from './_resolvers';


const passagemRoutes: Routes = [
  {
    path: '',
    component: PassagemComponent,
    children: [
      {
        path: '',
        component: PassagemDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.passagem,
          scopes: Scope.passagem_listar
        },
        resolve: {
          dados: PassagemListarResolver
        }
      },
      {
        path: 'listar2',
        component: PassagemDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.passagem,
          scopes: Scope.passagem_listar
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(passagemRoutes)],
  exports: [RouterModule]
})
export class PassagemRoutingModule { }
