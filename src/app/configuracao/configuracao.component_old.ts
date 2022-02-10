import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService, CarregadorService } from '../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracaoService } from './_services';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {
  public mnitems: MenuItem[];

  constructor(
    private aut: AuthenticationService,
    private cs: CarregadorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cfs: ConfiguracaoService
  ) { }

  ngOnInit(): void {
    console.log('GRAFICOS');
    this.criaMemu();
    this.cfs.configuracao = null;
  }

  criaMemu() {
    this.mnitems = [
      {
        label: 'Configurações',
        items: [
          {
            label: 'Áreas de Interesse',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['area_interesse']
          },
          {
            label: 'Assuntos',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['assunto']
          },
          {
            label: 'Companhias Aéreas',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['aerolinha']
          },
          {
            label: 'Escolaridade',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['escolaridade']
          },
          {
            label: 'Estados',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['estado']
          },
          {
            label: 'Estado Civil',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['estado_civil']
          },
          {
            label: 'Etiquetas',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['etiqueta_config']
          },
          {
            label: 'Grupos',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['grupo']
          },
          {
            label: 'Município',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['municipio']
          },
          {
            label: 'Núcleos',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['nucleo']
          },
          {
            label: 'O.G.U.',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['ogu']
          },
          {
            label: 'Origem da proposição',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['origem_proposicao']
          },
          {
            label: 'Orgão da proposição',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['orgao_proposicao']
          },
          {
            label: 'Prioridades',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['prioridade']
          },
          {
            label: 'Situação da proposição',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['situacao_proposicao']
          },
          {
            label: 'Tipo de Cadastro',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['tipo_cadastro']
          },
          {
            label: 'Tipo de Emenda',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['tipo_emenda']
          },
          {
            label: 'Tipo de Emenda de Proposição',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['emenda_proposicao']
          },
          {
            label: 'Tipo de Proposição',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['tipo_proposicao']
          },
          {
            label: 'Tipos de encaminhamento',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['andamento']
          },
          {
            label: 'Tipos de recebimento',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['tipo_recebimento']
          },
          {
            label: 'Tratamentos',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['tratamento']
          }
        ]
      }
    ];
    if (this.aut.usuario_incluir || this.aut.usuario_alterar || this.aut.usuario_apagar ) {
      this.mnitems[0].items.push(
        {
          label: 'Usuários',
          command: () => {
            this.cs.mostraCarregador();
          },
          routerLink: ['usuario']
        }
      );
    }
  }

  teste() {
    console.log('teste');
    this.cs.mostraCarregador();
  }

}
