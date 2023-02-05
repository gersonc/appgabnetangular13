import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthenticationService} from '../../_services';
import {MensagemOnoffService} from "../../_services/mensagem-onoff.service";
/*import {OnoffLineService} from "../../shared/onoff-line/onoff-line.service";*/
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import { DispositivoService } from "../../_services/dispositivo.service";
import { MenuDatatableService } from "../../_services/menu-datatable.service";
// import { IsOffLineService } from "../../shared/onoff-line/is-off-line.service";
import { OnoffLineService } from "../../shared/onoff-line/onoff-line.service";


@Component({
  selector: 'app-panelmenu',
  templateUrl: './panelmenu.component.html',
  styleUrls: ['./panelmenu.component.css']
})
export class PanelmenuComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mostra = false;
  @Input() recarrega = 'desktop';
  public items!: MenuItem[];
  // public menuPrincipalClasses = 'menu-principal-fechado';
  public menuPrincipalClasses = (this.md.mdt) ? 'menu-principal' : 'menu-principal-fechado';
  online = false;
  sub: Subscription[] = [];


  constructor(
    private authenticationService: AuthenticationService,
    private mo: MensagemOnoffService,
    public ol: OnoffLineService,
    private router: Router,
    public ds: DispositivoService,
    public md: MenuDatatableService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mostra) {
      this.md.mdt = this.mostra;
      // this.abreFechaMenuPrincipal();
    }
    if (changes.mostra) {
      this.carregaItens();
    }
  }

  ngOnInit(): void {
    if (!this.ol.ativo) {
      this.ol.handleAppConnectivityChanges();
    }
    this.sub.push(this.authenticationService.mostraMenu.subscribe(
      vf => {
        if (vf) {
          this.items = this.carregaItens();
        } else {
          this.limpaMenu();
        }
      }
    ));
    this.sub.push(this.ol.onoff.subscribe(
      vf => {
        if (!vf) {
          this.goHome();
        }
      }
    ));
  }

  public carregaItens() {
    this.items = [];
    this.items.push({
      label: 'Home', icon: 'pi pi-home', command: () => {
        this.fechaMenuPrincipal();
      }, routerLink: [''], routerLinkActiveOptions: '{exact: true}',
      disabled: this.ol.disabled
    });
    if (this.authenticationService.agenda) {
      this.items.push({
        label: 'Agenda', icon: 'pi pi-calendar', command: () => {
          this.fechaMenuPrincipal();
        }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/calendario'],
        disabled: this.ol.disabled
      });
    }
    if (this.authenticationService.cadastro) {
      if (this.authenticationService.cadastro_listar) {
        this.items.push(
          {
            label: 'Cadastros', icon: 'pi pi-id-card', command: () => {
              this.fechaMenuPrincipal();
            }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/cadastro'],
            disabled: this.ol.disabled
          });
      }
    }

    if (this.authenticationService.solicitacao) {
      if (this.authenticationService.solicitacao_listar) {
        this.items.push(
          {
            label: 'Solicitações', icon: 'pi pi-ticket', command: () => {
              this.fechaMenuPrincipal();
            },
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solic/listar'],
            disabled: this.ol.disabled
          });
      }
    }

    if (this.authenticationService.oficio) {
      if (this.authenticationService.oficio_vizualizar) {
        this.items.push(
          {
            label: 'Ofícios', icon: 'pi pi-file-o', command: () => {
              this.fechaMenuPrincipal();
            }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/oficio/listar'],
            disabled: this.ol.disabled
          });
      }
    }


    if (this.authenticationService.processo) {
      if (this.authenticationService.processo_listar) {
        this.items.push(
          {
            label: 'Processos', icon: 'pi pi-book', command: () => {
              this.fechaMenuPrincipal();
            }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/proce/listar'],
            disabled: this.ol.disabled
          });
      }
    }

    if (this.authenticationService.emenda) {
      if (this.authenticationService.emenda_listar) {
        this.items.push(
          {
            label: 'Emendas', icon: 'pi pi-credit-card', command: () => {
              this.fechaMenuPrincipal();
            }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/emenda'],
            disabled: this.ol.disabled
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
            routerLink: ['/proposicao'],
            disabled: this.ol.disabled
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
            routerLink: ['/telefone'],
            disabled: this.ol.disabled
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
            routerLink: ['/conta'],
            disabled: this.ol.disabled
          });
      }
    }

    if (this.authenticationService.contabilidade) {
      this.items.push(
        {
          label: 'Tarefa',
          icon: 'pi pi-inbox',
          command: () => {
            this.fechaMenuPrincipal();
          },
          routerLinkActiveOptions: '{exact: true}',
          routerLink: ['/tarefa'],
          disabled: this.ol.disabled
        });
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
            routerLink: ['/passagem'],
            disabled: this.ol.disabled
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
            routerLink: ['/configuracao'],
            disabled: this.ol.disabled
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
            routerLink: ['/arquivos'],
            disabled: this.ol.disabled
          });
      }
    }

    if (this.authenticationService.mensagem) {
      if (this.authenticationService.mensagem_enviar) {
        this.items.push(
          {
            label: 'Mensagens',
            icon: 'pi pi-comments',
            disabled: this.ol.disabled,
            items: [
              {
                label: 'Incluir',
                icon: 'pi pi-plus',
                command: () => {
                  this.fechaMenuPrincipal();
                  this.abreFormMensagem();
                }
              },
              {
                label: 'Listar',
                icon: 'pi pi-list',
                command: () => {
                  this.fechaMenuPrincipal();
                },
                routerLinkActiveOptions: '{exact: true}',
                routerLink: ['/mensagem']
              },
            ]

          });
      }
    }

    if (this.ds.dispositivo !== 'mobile') {
      this.items.push(
        {
          label: 'Gráficos',
          icon: 'pi pi-chart-bar',
          command: () => {
            this.fechaMenuPrincipal();
          },
          routerLinkActiveOptions: '{exact: true}',
          routerLink: ['/grafico'],
          disabled: this.ol.disabled
        });
    }

    this.items.push({
      label: 'Sair', icon: 'pi pi-sign-in', command: () => {
        this.authenticationService.logout();
        this.fechaMenuPrincipal();
      }, routerLink: ['login'], routerLinkActiveOptions: 'active',
      disabled: this.ol.disabled
    });
    return this.items;
  }

  limpaMenu() {
    this.items = [];
  }

  abreFechaMenuPrincipal() {
    this.md.togle();
    /*this.mostraMenuPrincipal = !this.mostraMenuPrincipal;
    if (this.mostraMenuPrincipal) {
      this.menuPrincipalClasses = 'menu-principal';
    } else {
      this.menuPrincipalClasses = 'menu-principal-fechado';
    }*/
  }

  fechaMenuPrincipal() {
    this.md.hide();
    // this.menuPrincipalClasses = 'menu-principal-fechado';
  }

  abreFormMensagem() {
    this.fechaMenuPrincipal();
    this.mo.msgform = true;
  }

  goHome() {
    if(this.authenticationService.permissoes_carregadas) {
      this.router.navigate(['/home']);
    } else {
      this.ngOnDestroy();
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    this.sub.forEach(s => s.unsubscribe());
  }

}
