import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import { ConfiguracaoComponent } from './configuracao.component';
import { ConfiguracaoTabelaComponent } from "./configuracao-tabela/configuracao-tabela.component";
import { EtiquetaConfigComponent } from "../etiqueta/etiqueta-config/etiqueta-config.component";
import { NucleoConfigComponent } from "../nucleo/nucleo-config/nucleo-config.component";
import { ConfiguracaoTabela2Component } from "./configuracao-tabela2/configuracao-tabela2.component";
import { UsuarioComponent } from "../usuario/usuario.component";


const confRoutes: Routes = [
  {
    path: '',
    component: ConfiguracaoComponent,
    // canActivate: [AuthChildGuard],
    children: [
      {
        path: '',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar
        },
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(confRoutes)],
  exports: [RouterModule]
})
export class ConfiguracaoRoutingModule { }
