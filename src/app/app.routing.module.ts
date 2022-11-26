import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, AuthChildGuard } from './_guards';
import { Rule } from './_models';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import {GraficosModule} from "./graficos/graficos.module";



const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () => import('./main2/main2.module').then(m => m.Main2Module),
    outlet: 'main2'
  },

  {
    path: 'calendario',
    loadChildren: () => import('./calendario/calendario.module').then(m => m.CalendarioModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.agenda
    }
  },

  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.cadastro
    }
  },
  /*{
    path: 'solic',
    loadChildren: () => import('./solic/solic.module').then(m => m.SolicModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.solicitacao
    }
  },*/
  {
    path: 'oficio',
    loadChildren: () => import('./oficio/oficio.module').then(m => m.OficioModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.oficio
    }
  },
  {
    path: 'proce',
    loadChildren: () => import('./proce/proce.module').then(m => m.ProceModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.processo
    }
  },
  {
    path: 'emenda',
    loadChildren: () => import('./emenda/emenda.module').then(m => m.EmendaModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.emenda
    }
  },
  {
    path: 'proposicao',
    loadChildren: () => import('./proposicao/proposicao.module').then(m => m.ProposicaoModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.processo
    }
  },
  {
    path: 'telefone',
    loadChildren: () => import('./telefone/telefone.module').then(m => m.TelefoneModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.telefone
    }
  },
  {
    path: 'conta',
    loadChildren: () => import('./conta/conta.module').then(m => m.ContaModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.contabilidade
    }
  },
  {
    path: 'passagem',
    loadChildren: () => import('./passagem/passagem.module').then(m => m.PassagemModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.passagem
    }
  },
  {
    path: 'tarefa',
    loadChildren: () => import('./tarefa/tarefa.module').then(m => m.TarefaModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.tarefa
    }
  },
  {
    path: 'configuracao',
    loadChildren: () => import('./configuracao/configuracao.module').then(m => m.ConfiguracaoModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.configuracao
    }
  },
  {
    path: 'grafico',
    loadChildren: () => import('./graficos/graficos.module').then(m => m.GraficosModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.configuracao
    }
  },
  {
    path: 'arquivos',
    loadChildren: () => import('./explorer/explorer.module').then(m => m.ExplorerModule),
    canActivate: [AuthGuard],
    data: {
      rules: Rule.arquivos
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'solic', loadChildren: () => import('./solic/solic.module').then(m => m.SolicModule) },


  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
