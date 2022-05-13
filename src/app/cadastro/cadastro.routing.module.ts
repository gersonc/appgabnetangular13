import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard} from '../_guards';
import { Rule, Scope } from '../_models';
import { CadastroAlterarComponent } from './cadastro-alterar';
import { CadastroDetalheComponent } from './cadastro-detalhe';
import { CadastroIncluirComponent } from './cadastro-incluir';
import { CadastroListarResolver, CadastroFormResolver, CadastroExcluirResolver } from './_resolvers';
import { CadastroExcluirComponent } from './cadastro-excluir';
import { CadastroComponent } from './cadastro.component';
import { CadastroDatatableComponent } from './cadastro-datatable';
import { CadastroSmsDatatableComponent } from './cadastro-sms-datatable';

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
        path: 'listar/sms/busca',
        component: CadastroSmsDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.sms,
          scopes: Scope.sms_incluir
        },
        resolve: {
          dados: CadastroListarResolver
        }
      },
      {
        path: 'listar/sms',
        component: CadastroSmsDatatableComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.sms,
          scopes: Scope.sms_incluir
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
        component: CadastroIncluirComponent,
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
        component: CadastroIncluirComponent,
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
        path: 'alterar/:id',
        component: CadastroAlterarComponent,
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
        path: 'excluir/:id',
        component: CadastroExcluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_apagar
        },
        resolve: {
          dados: CadastroExcluirResolver
        }
      },
      {
        path: 'detalhe',
        component: CadastroDetalheComponent,
        canActivate: [AuthChildGuard],
        data: {
          scopes: [Scope.cadastro_listar]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(cadastroRoutes)],
  exports: [RouterModule]
})
export class CadastroRoutingModule {
}
