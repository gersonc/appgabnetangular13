import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard} from '../_guards';
import { Rule, Scope } from '../_models';
import { CadastroComponent } from './cadastro.component';
import { CadastroDatatableComponent } from './cadastro-datatable';
import {CadastroListarResolver} from "./_resolvers/cadastro-listar.resolver";
import {CadastroFormResolver} from "./_resolvers/cadastro-form.resolver";
import {CadastroFormComponent} from "./cadastro-form/cadastro-form.component";
import {CadastroExcluirComponent} from "./cadastro-excluir/cadastro-excluir.component";
import {CadastroExcluirResolver} from "./_resolvers/cadastro-excluir.resolver";

const cadastroRoutes: Routes = [
  {
    path: '',
    component: CadastroComponent,
    children: [
      {
        path: '',
        component: CadastroDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_listar
        },
        resolve: {
          dados: CadastroListarResolver
        }
      },
      {
        path: 'listar/busca',
        component: CadastroDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_listar
        },
        resolve: {
          dados: CadastroListarResolver
        }
      },
      {
        path: 'listar',
        component: CadastroDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_listar
        }
      },
      {
        path: 'incluir',
        component: CadastroFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_incluir
        },
        resolve: {
          dados: CadastroFormResolver
        }
      },
      {
        path: 'incluir/:modulo/:componente',
        component: CadastroFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_incluir
        },
        resolve: {
          dados: CadastroFormResolver
        }
      },
      {
        path: 'alterar',
        component: CadastroFormComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_alterar
        },
        resolve: {
          dados: CadastroFormResolver
        }
      },

      {
        path: 'excluir',
        component: CadastroExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_apagar
        }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(cadastroRoutes)],
  exports: [RouterModule]
})
export class CadastroRoutingModule {
}
