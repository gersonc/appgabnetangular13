import {Component, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuService } from '../_service';
import { AuthenticationService, CarregadorService } from '../../_services';



@Component({
  selector: 'app-panelmenu',
  templateUrl: './panelmenu.component.html',
  styleUrls: ['./panelmenu.component.css']
})
export class PanelmenuComponent implements OnInit, OnChanges {
  @Input() mostra = false;
  public items!: MenuItem[];
  public menuPrincipalClasses = 'menu-principal-fechado';
  public mostraMenuPrincipal = true;

  constructor(
    // private cs: CarregadorService,
    private menuService: MenuService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mostra) {
      this.abreFechaMenuPrincipal();
    }
  }

  ngOnInit(): void {
    this.items = this.itens;
  }

  public get itens() {
    this.items = [];
    if (this.authenticationService.agenda) {
      this.items.push({label: 'Home', icon: 'fas fa-home',command: () => { this.fechaMenuPrincipal(); }, routerLink: [''], routerLinkActiveOptions: '{exact: true}'});
      this.items.push({label: 'Calendario', icon: 'fas fa-home',command: () => { this.fechaMenuPrincipal(); }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/calendario']});
    }
    if (this.authenticationService.cadastro) {
      if (this.authenticationService.cadastro_listar) {
        this.items.push(
          {label: 'Cadastros', icon: 'far fa-address-card',command: () => { this.fechaMenuPrincipal(); }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/cadastro'] });
      }
      if (!this.authenticationService.cadastro_listar && this.authenticationService.cadastro_incluir) {
        this.items.push(
          {label: 'Cadastro Incluir', icon: 'pi-user-plus',command: () => { this.fechaMenuPrincipal(); }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/cadastro/incluir'] });
      }
    }

    if (this.authenticationService.solicitacao) {
      if (this.authenticationService.solicitacao_listar) {
        this.items.push(
          {label: 'Solicitações', icon: 'far fa-address-card',command: () => { this.fechaMenuPrincipal(); },
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacao/listar'] });
      }
      if (!this.authenticationService.solicitacao_listar && this.authenticationService.solicitacao_incluir) {
        this.items.push(
          {label: 'Solicitação Incluir', icon: 'pi-user-plus',command: () => { this.fechaMenuPrincipal(); },
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacao/incluir'] });
      }
    }

    if (this.authenticationService.oficio) {
      if (this.authenticationService.oficio_vizualizar) {
        this.items.push(
          {label: 'Ofícios', icon: 'far fa-address-card',command: () => { this.fechaMenuPrincipal(); }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/oficio/listar'] });
      }
      if (!this.authenticationService.oficio_vizualizar && this.authenticationService.oficio_incluir) {
        this.items.push(
          {label: 'Ofício Incluir', icon: 'pi-user-plus',command: () => { this.fechaMenuPrincipal(); }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/oficio/incluir'] });
      }
    }

    if (this.authenticationService.processo) {
      if (this.authenticationService.processo_listar) {
        this.items.push(
          {label: 'Processos', icon: 'far fa-address-card',command: () => { this.fechaMenuPrincipal(); }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/processo/listar'] });
      }
    }

    if (this.authenticationService.emenda) {
      if (this.authenticationService.emenda_listar) {
        this.items.push(
          {label: 'Emendas', icon: 'far fa-address-card',command: () => { this.fechaMenuPrincipal(); }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/emenda'] });
      }
      if (!this.authenticationService.emenda_listar && this.authenticationService.emenda_incluir) {
        this.items.push(
          {label: 'Emendas Incluir', icon: 'pi-user-plus',command: () => { this.fechaMenuPrincipal(); }, routerLinkActiveOptions: '{exact: true}', routerLink: ['/emenda/incluir'] });
      }
    }

    if (this.authenticationService.proposicao) {
      if (this.authenticationService.proposicao_listar) {
        this.items.push(
          {
            label: 'Proposições',
            icon: 'far fa-address-card',
            command: () => { this.fechaMenuPrincipal(); },
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
            icon: 'far fa-address-card',
            command: () => { this.fechaMenuPrincipal(); },
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
            icon: 'far fa-address-card',
            command: () => { this.fechaMenuPrincipal(); },
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
            icon: 'far fa-address-card',
            command: () => { this.fechaMenuPrincipal(); },
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
            icon: 'far fa-address-card',
            command: () => { this.fechaMenuPrincipal(); },
            routerLinkActiveOptions: '{exact: true}',
            routerLink: ['/configuracao']
          });
      }
    }

    this.items.push(
      {
        label: 'Tarefa',
        icon: 'far fa-address-card',
        command: () => { this.fechaMenuPrincipal(); },
        routerLinkActiveOptions: '{exact: true}',
        routerLink: ['/tarefa']
      });

    this.items.push(
      {
        label: 'Gráficos',
        icon: 'far fa-address-card',
        command: () => { this.fechaMenuPrincipal(); },
        routerLinkActiveOptions: '{exact: true}',
        routerLink: ['/grafico']
      });

    this.items.push({label: 'Sair', icon: 'fas fa-sign-out-alt', command: () => {
      this.authenticationService.logout();
      this.fechaMenuPrincipal();
      }, routerLink: ['login'], routerLinkActiveOptions: 'active'});
    return this.items;
  }

  abreFechaMenuPrincipal() {
    console.log('abreFechaMenuPrincipal');
    this.mostraMenuPrincipal = !this.mostraMenuPrincipal;
    if (this.mostraMenuPrincipal) {
      this.menuPrincipalClasses = 'menu-principal';
    } else {
      this.menuPrincipalClasses = 'menu-principal-fechado';
    }
  }

  abreMenuPrincipal() {
    console.log('cs 08');
    this.mostraMenuPrincipal = true;
    this.menuPrincipalClasses = 'menu-principal';
  }

  fechaMenuPrincipal() {
    console.log('fechaMenuPrincipal');
    this.mostraMenuPrincipal = false;
    this.menuPrincipalClasses = 'menu-principal-fechado';
    // this.cs.escondeCarregador();

  }

}
