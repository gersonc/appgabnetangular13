import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService, CarregadorService } from '../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracaoService } from './_services';
import {ConfiguracaoMenuIntensInterface} from "./_models/configuracao-model";

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {
  public mnitems: MenuItem[];
  public menuCfgItens: ConfiguracaoMenuIntensInterface[];
  public cfgItem: ConfiguracaoMenuIntensInterface;
  public componente: string;
  public tipoComp = 0;

  constructor(
    private aut: AuthenticationService,
    private cs: CarregadorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cfs: ConfiguracaoService
  ) {
    this.menuCfgItens = [
      {
        label: 'Áreas de Interesse',
        code: 'area_interesse'
      },
      {
        label: 'Assuntos',
        code: 'assunto'
      },
      {
        label: 'Companhias Aéreas',
        code: 'aerolinha'
      },
      {
        label: 'Escolaridade',
        code: 'escolaridade'
      },
      {
        label: 'Estados',
        code: 'estado'
      },
      {
        label: 'Estado Civil',
        code: 'estado_civil'
      },
      {
        label: 'Etiquetas',
        code: 'etiqueta_config'
      },
      {
        label: 'Grupos',
        code: 'grupo'
      },
      {
        label: 'Município',
        code: 'municipio'
      },
      {
        label: 'Núcleos',
        code: 'nucleo'
      },
      {
        label: 'O.G.U.',
        code: 'ogu'
      },
      {
        label: 'Origem da proposição',
        code: 'origem_proposicao'
      },
      {
        label: 'Orgão da proposição',
        code: 'orgao_proposicao'
      },
      {
        label: 'Prioridades',
        code: 'prioridade'
      },
      {
        label: 'Situação da proposição',
        code: 'situacao_proposicao'
      },
      {
        label: 'Tipo de Cadastro',
        code: 'tipo_cadastro'
      },
      {
        label: 'Tipo de Emenda',
        code: 'tipo_emenda'
      },
      {
        label: 'Tipo de Emenda de Proposição',
        code: 'emenda_proposicao'
      },
      {
        label: 'Tipo de Proposição',
        code: 'tipo_proposicao'
      },
      {
        label: 'Tipos de encaminhamento',
        code: 'andamento'
      },
      {
        label: 'Tipos de recebimento',
        code: 'tipo_recebimento'
      },
      {
        label: 'Tratamentos',
        code: 'tratamento'
      }
    ];
    if (this.aut.usuario_incluir || this.aut.usuario_alterar || this.aut.usuario_apagar ) {
      this.menuCfgItens.push(
        {
          label: 'Usuários',
          code: 'usuario'
        }
      );
    }
  }

  ngOnInit(): void {
    console.log('GRAFICOS');
    // this.criaMemu();
    this.cfs.configuracao = null;
  }

  selectCfg(event) {
    console.log(event);
    this.cs.mostraCarregador();
    this.componente = event.value;
    switch (this.componente) {
      case 'etiqueta_config': {
        this.tipoComp = 3;
        break;
      }
      case 'nucleo': {
        this.tipoComp = 4;
        break;
      }
      case 'prioridade': {
        this.tipoComp = 2;
        break;
      }
      case 'tipo_cadastro': {
        this.tipoComp = 2;
        break;
      }
      case 'usuario': {
        this.tipoComp = 5;
        break;
      }
      default: {
        this.tipoComp = 1;
        break;
      }
    }

  }

  teste() {
    console.log('teste');
    this.cs.mostraCarregador();
  }

}
