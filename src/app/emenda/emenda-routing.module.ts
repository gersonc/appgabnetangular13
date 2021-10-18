import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import { EmendaComponent } from "./emenda.component";
import { EmendaResolver, EmendaIncluirResolver } from "./_resolvers";
import { EmendaDatatableComponent } from "./emenda-datatable/emenda-datatable.component";
import { EmendaIncluirComponent } from "./emenda-incluir/emenda-incluir.component";
import { EmendaCadastroIncluirComponent } from "./emenda-cadastro-incluir/emenda-cadastro-incluir.component";
import { EmendaCadastroFormResolver } from "./_resolvers/emenda-cadastro-form.resolver";
import { EmendaAlterarComponent } from "./emenda-alterar/emenda-alterar.component";
import { EmendaExcluirComponent } from "./emenda-excluir/emenda-excluir.component";

const emendaRoutes: Routes = [
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
          dados: EmendaResolver
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
          dados: EmendaResolver
        }
      },
      {
        path: 'incluir/cadastro/:modulo',
        component: EmendaIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_incluir
        },
        resolve: {
          dados: EmendaIncluirResolver
        }
      },
      {
        path: 'incluir',
        component: EmendaIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_incluir
        },
        resolve: {
          dados: EmendaIncluirResolver
        }
      },
      {
        path: 'alterar',
        component: EmendaAlterarComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.emenda,
          scopes: Scope.emenda_alterar
        },
        resolve: {
          dados: EmendaIncluirResolver
        }
      },
      {
        path: 'cadastro',
        component: EmendaCadastroIncluirComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.cadastro,
          scopes: Scope.cadastro_incluir
        },
        resolve: {
          dados: EmendaCadastroFormResolver
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
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(emendaRoutes)],
  exports: [RouterModule]
})
export class EmendaRoutingModule { }
