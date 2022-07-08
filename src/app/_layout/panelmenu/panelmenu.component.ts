import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuService} from '../_service';
import {AuthenticationService} from '../../_services';


@Component({
  selector: 'app-panelmenu',
  templateUrl: './panelmenu.component.html',
  styleUrls: ['./panelmenu.component.css']
})
export class PanelmenuComponent implements OnInit, OnChanges {
  @Input() mostra = false;
  @Input() recarrega: string = 'desktop';
  public items!: MenuItem[];
  public menuPrincipalClasses = 'menu-principal-fechado';
  public mostraMenuPrincipal = true;

  constructor(
    // private menuService: MenuService,
    private authenticationService: AuthenticationService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mostra) {
      this.abreFechaMenuPrincipal();
    }
    if (changes.mostra) {
      this.carregaItens();
    }
  }

  ngOnInit(): void {
    this.authenticationService.mostraMenu.subscribe(
      vf => {
        if (vf) {
          this.items = this.carregaItens();
        } else {
          this.limpaMenu();
        }
      }
    )
  }

  public carregaItens() {
    this.items = [];
    this.items.push({
      label: 'Home', icon: 'pi pi-home', command: () => {
        this.fechaMenuPrincipal();
      }, routerLink: [''], routerLinkActiveOptions: '{exact: true}'
    });
    if (this.authenticationService.agenda) {
      this.items.push({
        label: 'Agenda', icon: 'pi pi-calendar', command: () => {
          this.fechaMenuPrincipal();
        }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/calendario']
      });
    }
    if (this.authenticationService.cadastro) {
      if (this.authenticationService.cadastro_listar) {
        this.items.push(
          {
            label: 'Cadastros', icon: 'pi pi-id-card', command: () => {
              this.fechaMenuPrincipal();
            }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/cadastro']
          });
      }
    }

    /*if (this.authenticationService.solicitacao) {
      if (this.authenticationService.solicitacao_listar) {
        this.items.push(
          {
            label: 'Solicitações', icon: 'pi pi-ticket', command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacao/listar']
          });
      }
    }

    if (this.authenticationService.solicitacao) {
      if (this.authenticationService.solicitacao_listar) {
        this.items.push(
          {
            label: 'Solicitação Simples', icon: 'pi pi-ticket', command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacaosimples/listar']
          });
      }
    }

    if (this.authenticationService.solicitacao) {
      if (this.authenticationService.solicitacao_listar) {
        this.items.push(
          {
            label: 'SolicitaçõesT1', icon: 'pi pi-ticket', command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacaot1/listar']
          });
      }
    }*/

    if (this.authenticationService.solicitacao) {
      if (this.authenticationService.solicitacao_listar) {
        this.items.push(
          {
            label: 'Solic', icon: 'pi pi-ticket', command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solic/listar']
          });
      }
    }

    if (this.authenticationService.oficio) {
      if (this.authenticationService.oficio_vizualizar) {
        this.items.push(
          {
            label: 'Ofícios', icon: 'pi pi-file-o', command: () => {
              this.fechaMenuPrincipal();
            }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/oficio/listar']
          });
      }
    }

    if (this.authenticationService.processo) {
      if (this.authenticationService.processo_listar) {
        this.items.push(
          {
            label: 'Processos', icon: 'pi pi-book', command: () => {
              this.fechaMenuPrincipal();
            }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/processo/listar']
          });
      }
    }

    if (this.authenticationService.processo) {
      if (this.authenticationService.processo_listar) {
        this.items.push(
          {
            label: 'Proce', icon: 'pi pi-book', command: () => {
              this.fechaMenuPrincipal();
            }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/proce/listar']
          });
      }
    }

    if (this.authenticationService.emenda) {
      if (this.authenticationService.emenda_listar) {
        this.items.push(
          {
            label: 'Emendas', icon: 'pi pi-credit-card', command: () => {
              this.fechaMenuPrincipal();
            }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/emenda']
          });
      }
    }

    if (this.authenticationService.proposicao) {
      if (this.authenticationService.proposicao_listar) {
        this.items.push(
          {
            label: 'Proposições',
            icon: 'pi pi-tags',
            command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}',
            routerLink: ['/proposicao']
          });
      }
    }

    if (this.authenticationService.telefone) {
      if (this.authenticationService.telefone_listar) {
        this.items.push(
          {
            label: 'Telefones',
            icon: 'pi pi-phone',
            command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}',
            routerLink: ['/telefone']
          });
      }
    }

    if (this.authenticationService.contabilidade) {
      if (this.authenticationService.contabilidade_listar) {
        this.items.push(
          {
            label: 'Contabilidade',
            icon: 'pi pi-money-bill',
            command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}',
            routerLink: ['/conta']
          });
      }
    }

    if (this.authenticationService.passagemaerea) {
      if (this.authenticationService.passagemaerea_listar) {
        this.items.push(
          {
            label: 'Passagens Aéreas',
            icon: 'pi pi-send',
            command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}',
            routerLink: ['/passagem']
          });
      }
    }

    if (this.authenticationService.configuracao) {
      if (this.authenticationService.configuracao_alterar || this.authenticationService.configuracao_incluir || this.authenticationService.configuracao_apagar) {
        this.items.push(
          {
            label: 'Configurações',
            icon: 'pi pi-cog',
            command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}',
            routerLink: ['/configuracao']
          });
      }
    }

    if (this.authenticationService.arquivos) {
      if (this.authenticationService.arquivos_baixar) {
        this.items.push(
          {
            label: 'Arquivos',
            icon: 'pi pi-folder',
            command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}',
            routerLink: ['/arquivos']
          });
      }
    }

    this.items.push(
      {
        label: 'Tarefa',
        icon: 'pi pi-inbox',
        command: () => {
          this.fechaMenuPrincipal();
        },
        routerLinkActiveOptions: '{exact: true}',
        routerLink: ['/tarefa']
      });

    if (this.authenticationService.dispositivo !== 'mobile') {
      this.items.push(
        {
          label: 'Gráficos',
          icon: 'pi pi-chart-bar',
          command: () => {
            this.fechaMenuPrincipal();
          },
          routerLinkActiveOptions: '{exact: true}',
          routerLink: ['/grafico']
        });
    }

    this.items.push({
      label: 'Sair', icon: 'pi pi-sign-in', command: () => {
        this.authenticationService.logout();
        this.fechaMenuPrincipal();
      }, routerLink: ['login'], routerLinkActiveOptions: 'active'
    });
    return this.items;
  }

  limpaMenu() {
    this.items = [];
  }


  abreFechaMenuPrincipal() {
    this.mostraMenuPrincipal = !this.mostraMenuPrincipal;
    if (this.mostraMenuPrincipal) {
      this.menuPrincipalClasses = 'menu-principal';
    } else {
      this.menuPrincipalClasses = 'menu-principal-fechado';
    }
  }

  fechaMenuPrincipal() {
    this.mostraMenuPrincipal = false;
    this.menuPrincipalClasses = 'menu-principal-fechado';
  }

}
