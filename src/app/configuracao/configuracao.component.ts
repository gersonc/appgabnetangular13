import {Component, OnInit} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracaoService } from './_services';
import {
  Configuracao2ModelInterface,
  ConfiguracaoMenuIntensInterface,
  ConfiguracaoModelInterface
} from "./_models/configuracao-model";
import {WindowsService} from "../_layout/_service";
import { DispositivoService } from "../_services/dispositivo.service";

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {
  public mnitems: MenuItem[];
  public menuCfgItens: ConfiguracaoMenuIntensInterface[] = [
    {
      label: 'Áreas de Interesse',
      code: 'area_interesse'
    },
    {
      label: 'Agenda Status',
      code: 'calendario_status'
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
      label: 'Regiões',
      code: 'regiao'
    },
    {
      label: 'Situação da emenda',
      code: 'emenda_situacao'
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
      label: 'Tipo de Evento (Agenda)',
      code: 'evento_type'
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
  public cfgItem: ConfiguracaoMenuIntensInterface = {
    label: 'CONFIGURAÇÕES',
    code: ''
  };
  titulo = "CONFIGURAÇÕES"
  public componente: string;
  public tipoComp = 0;
  confTitulo: ConfiguracaoModelInterface = {
    tabela: null,
    campo_id: null,
    campo_nome: null,
    titulo: 'CONFIGURAÇÕES',
    texto: null
  }
  checked: boolean = this.ds.dispositivo === 'mobile';
  medidas: any = {};
  altura = `${+WindowsService.getCorpo().altura}` + 'px';
  altura2 = `${WindowsService.getCorpo().altura - 200}` + 'px';
  ddAltura = `${(+WindowsService.getCorpo().altura / 5)}` + 'px';

  constructor(
    private aut: AuthenticationService,
    // private activatedRoute: ActivatedRoute,
    // private router: Router,
    public ds: DispositivoService,
    public cfs: ConfiguracaoService
  ) {

  }

  ngOnInit(): void {  }

  onConfTitulo(ev: ConfiguracaoModelInterface | Configuracao2ModelInterface) {
    this.confTitulo = ev;
    this.titulo = ev.titulo;
  }


  mudaDispositivo() {
    if (this.ds.dispositivo !== 'mobile') {
      this.ds.dispositivo = 'mobile';
    } else {
      this.ds.dispositivo = 'desktop';
    }
  }

  selectCfg(ev) {
    this.componente = this.cfgItem.code;
    switch (this.componente) {
      case 'etiqueta_config': {
        this.tipoComp = 3;
        break;
      }
      case 'nucleo': {
        this.tipoComp = 4;
        break;
      }
      case 'calendario_status': {
        this.tipoComp = 2;
        break;
      }
      case 'evento_type': {
        this.tipoComp = 2;
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

  getAlturaScrInterno(): number {
    return +WindowsService.getCorpo().altura - 2*(WindowsService.getMedidas('conf01').altura + WindowsService.getMedidas('conf02').altura) -100;
  }

  teste() {
  }

}
