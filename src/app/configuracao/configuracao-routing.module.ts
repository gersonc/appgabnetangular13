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
        path: 'area_interesse',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'area_interesse',
            campo_id: 'area_interesse_id',
            campo_nome: 'area_interesse_nome',
            titulo: 'ÁREAS DE INTERESSE',
            texto: 'a área de interesse'
          }
        },
      },
      {
        path: 'assunto',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'assunto',
            campo_id: 'assunto_id',
            campo_nome: 'assunto_nome',
            titulo: 'ASSUNTOS',
            texto: 'o assunto'
          }
        },
      },
      {
        path: 'aerolinha',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'aerolinha',
            campo_id: 'aerolinha_id',
            campo_nome: 'aerolinha_nome',
            titulo: 'COMPANHIAS AÉREAS',
            texto: 'a companhias aérea'
          }
        },
      },
      {
        path: 'escolaridade',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'escolaridade',
            campo_id: 'escolaridade_id',
            campo_nome: 'escolaridade_nome',
            titulo: 'ESCOLARIDADE',
            texto: 'a escolaridade'
          }
        },
      },
      {
        path: 'estado',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'estado',
            campo_id: 'estado_id',
            campo_nome: 'estado_nome',
            titulo: 'ESTADOS',
            texto: 'o estado'
          }
        },
      },
      {
        path: 'estado_civil',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'estado_civil',
            campo_id: 'estado_civil_id',
            campo_nome: 'estado_civil_nome',
            titulo: 'ESTADO CIVIL',
            texto: 'o estado civil'
          }
        },
      },
      {
        path: 'grupo',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'grupo',
            campo_id: 'grupo_id',
            campo_nome: 'grupo_nome',
            titulo: 'GRUPOS',
            texto: 'o grupo'
          }
        },
      },
      {
        path: 'municipio',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'municipio',
            campo_id: 'municipio_id',
            campo_nome: 'municipio_nome',
            titulo: 'MUNICÍPIOS',
            texto: 'o município'
          }
        },
      },
      {
        path: 'ogu',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'ogu',
            campo_id: 'ogu_id',
            campo_nome: 'ogu_nome',
            titulo: 'O.G.U.',
            texto: 'o O.G.U.'
          }
        },
      },
      {
        path: 'origem_proposicao',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'origem_proposicao',
            campo_id: 'origem_proposicao_id',
            campo_nome: 'origem_proposicao_nome',
            titulo: 'ORIGEM DA PROPOSIÇÃO',
            texto: 'a origem da proposicao'
          }
        },
      },
      {
        path: 'orgao_proposicao',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'orgao_proposicao',
            campo_id: 'orgao_proposicao_id',
            campo_nome: 'orgao_proposicao_nome',
            titulo: 'ORGÃO DA PROPOSIÇÃO',
            texto: 'o orgão da proposicao'
          }
        },
      },
      {
        path: 'tipo_emenda',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'tipo_emenda',
            campo_id: 'tipo_emenda_id',
            campo_nome: 'tipo_emenda_nome',
            titulo: 'TIPO DE EMENDA',
            texto: 'o tipo de emenda'
          }
        },
      },
      {
        path: 'tipo_proposicao',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'tipo_proposicao',
            campo_id: 'tipo_proposicao_id',
            campo_nome: 'tipo_proposicao_nome',
            titulo: 'TIPO DE PROPOSIÇÃO',
            texto: 'o tipo de proposição'
          }
        },
      },
      {
        path: 'emenda_proposicao',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'emenda_proposicao',
            campo_id: 'emenda_proposicao_id',
            campo_nome: 'emenda_proposicao_nome',
            titulo: 'TIPO DE EMEDA DE PROPOSIÇÃO',
            texto: 'o tipo de emenda de proposição'
          }
        },
      },
      {
        path: 'emenda_proposicao',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'emenda_proposicao',
            campo_id: 'emenda_proposicao_id',
            campo_nome: 'emenda_proposicao_nome',
            titulo: 'TIPO DE EMEDA DE PROPOSIÇÃO',
            texto: 'o tipo de emenda de proposição'
          }
        },
      },
      {
        path: 'andamento',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'andamento',
            campo_id: 'andamento_id',
            campo_nome: 'andamento_nome',
            titulo: 'TIPOS DE ENCAMINHAMENTO',
            texto: 'o tipo de encaminhamento'
          }
        },
      },
      {
        path: 'tipo_recebimento',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'tipo_recebimento',
            campo_id: 'tipo_recebimento_id',
            campo_nome: 'tipo_recebimento_nome',
            titulo: 'TIPOS DE RECEBIMENTOS',
            texto: 'o tipo de recebimento'
          }
        },
      },
      {
        path: 'tratamento',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'tratamento',
            campo_id: 'tratamento_id',
            campo_nome: 'tratamento_nome',
            titulo: 'TRATAMENTOS',
            texto: 'o tratamento'
          }
        },
      },
      {
        path: 'situacao_proposicao',
        component: ConfiguracaoTabelaComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'situacao_proposicao',
            campo_id: 'situacao_proposicao_id',
            campo_nome: 'situacao_proposicao_nome',
            titulo: 'SITUAÇÃO DA PROPOSIÇÃO',
            texto: 'a situação da proposição'
          }
        },
      },
      {
        path: 'etiqueta_config',
        component: EtiquetaConfigComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'etiquetas',
            campo_id: 'etq_id',
            campo_nome: 'etq_modelo',
            titulo: 'ETIQUETAS',
            texto: 'a etiqueta'
          }
        },
      },
      {
        path: 'nucleo',
        component: NucleoConfigComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'local',
            campo_id: 'local_id',
            campo_nome: 'local_nome',
            titulo: 'NÚCLEO',
            texto: 'o núcleo'
          }
        },
      },
      {
        path: 'prioridade',
        component: ConfiguracaoTabela2Component,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'prioridade',
            campo_id: 'prioridade_id',
            campo_nome: 'prioridade_nome',
            campo_txt1: 'prioridade_color',
            titulo: 'PRIORIDADE',
            labelTxt1: 'COR',
            texto: 'a prioridade'
          }
        },
      },
      {
        path: 'tipo_cadastro',
        component: ConfiguracaoTabela2Component,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'tipo_cadastro',
            campo_id: 'tipo_cadastro_id',
            campo_id2: 'tipo_cadastro_tipo',
            campo_nome: 'tipo_cadastro_nome',
            titulo: 'TIPO DE CADASTRO',
            labelTxt1: 'PF/PJ',
            texto: 'o tipo de cadastro'
          }
        },
      },
      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [AuthChildGuard],
        data: {
          rules: Rule.configuracao,
          scopes: Scope.configuracao_alterar,
          dados: {
            tabela: 'usuario',
            titulo: 'USUARIO'
          }
        },
      },


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
