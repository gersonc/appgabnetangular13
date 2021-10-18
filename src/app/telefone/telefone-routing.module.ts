import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import { TelefoneComponent } from './telefone.component';
import { TelefoneDatatableComponent } from './telefone-datatable/telefone-datatable.component';
import { TelefoneListarResolver } from './_resolvers';


const telefoneRoutes: Routes = [
  {
    path: '',
    component: TelefoneComponent,
    children: [
      {
        path: '',
        component: TelefoneDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.telefone,
          scopes: Scope.telefone_listar
        },
        resolve: {
          dados: TelefoneListarResolver
        }
      },
      {
        path: 'listar2',
        component: TelefoneDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.telefone,
          scopes: Scope.telefone_listar
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(telefoneRoutes)],
  exports: [RouterModule]
})
export class TelefoneRoutingModule { }
