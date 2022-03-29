import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../../_services';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private items: MenuItem[] = [];

  constructor(private authenticationService: AuthenticationService) { }

  public get itens() {
    this.items = [];
    if (this.authenticationService.agenda) {
      this.items.push({label: 'Home', icon: 'fas fa-home', routerLink: [''], routerLinkActiveOptions: '{exact: true}'});
      this.items.push({label: 'Calendario', icon: 'fas fa-home', routerLinkActiveOptions: '{exact: true}', routerLink: ['/calendario']});
    }
    if (this.authenticationService.cadastro) {
      if (this.authenticationService.cadastro_listar) {
        this.items.push(
          {label: 'Cadastros', icon: 'far fa-address-card', routerLinkActiveOptions: '{exact: true}', routerLink: ['/cadastro'] });
      }
      if (!this.authenticationService.cadastro_listar && this.authenticationService.cadastro_incluir) {
        this.items.push(
          {label: 'Cadastro Incluir', icon: 'pi-user-plus', routerLinkActiveOptions: '{exact: true}', routerLink: ['/cadastro/incluir'] });
      }
    }

    if (this.authenticationService.solicitacao) {
      if (this.authenticationService.solicitacao_listar) {
        this.items.push(
          {label: 'Solicitações', routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacao/listar'] });
      }
      if (!this.authenticationService.solicitacao_listar && this.authenticationService.solicitacao_incluir) {
        this.items.push(
          {label: 'Solicitação Incluir', icon: 'pi-user-plus',
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacao/incluir'] });
      }
    }

    if (this.authenticationService.solicitacao) {
      if (this.authenticationService.solicitacao_listar) {
        this.items.push(
          {label: 'SolicitaçõesT1', routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacaot1/listar'] });
      }
      if (!this.authenticationService.solicitacao_listar && this.authenticationService.solicitacao_incluir) {
        this.items.push(
          {label: 'Solicitação Incluir', icon: 'pi-user-plus',
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacao11/incluir'] });
      }
    }

    if (this.authenticationService.solicitacao) {
      if (this.authenticationService.solicitacao_listar) {
        this.items.push(
          {label: 'SolicitaçõesT2', routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacaot2/listar'] });
      }
      if (!this.authenticationService.solicitacao_listar && this.authenticationService.solicitacao_incluir) {
        this.items.push(
          {label: 'Solicitação Incluir', icon: 'pi-user-plus',
            routerLinkActiveOptions: '{exact: true}', routerLink: ['/solicitacaot2/incluir'] });
      }
    }

    if (this.authenticationService.oficio) {
      if (this.authenticationService.oficio_vizualizar) {
        this.items.push(
          {label: 'Ofícios', icon: 'far fa-address-card', routerLinkActiveOptions: '{exact: true}', routerLink: ['/oficio/listar'] });
      }
      if (!this.authenticationService.oficio_vizualizar && this.authenticationService.oficio_incluir) {
        this.items.push(
          {label: 'Ofício Incluir', icon: 'pi-user-plus', routerLinkActiveOptions: '{exact: true}', routerLink: ['/oficio/incluir'] });
      }
    }

    if (this.authenticationService.processo) {
      if (this.authenticationService.processo_listar) {
        this.items.push(
          {label: 'Processos', icon: 'far fa-address-card', routerLinkActiveOptions: '{exact: true}', routerLink: ['/processo/listar'] });
      }
    }

    if (this.authenticationService.emenda) {
      if (this.authenticationService.emenda_listar) {
        this.items.push(
          {label: 'Emendas', icon: 'far fa-address-card', routerLinkActiveOptions: '{exact: true}', routerLink: ['/emenda'] });
      }
      if (!this.authenticationService.emenda_listar && this.authenticationService.emenda_incluir) {
        this.items.push(
          {label: 'Emendas Incluir', icon: 'pi-user-plus', routerLinkActiveOptions: '{exact: true}', routerLink: ['/emenda/incluir'] });
      }
    }

    if (this.authenticationService.proposicao) {
      if (this.authenticationService.proposicao_listar) {
        this.items.push(
          {
            label: 'Proposições',
            icon: 'far fa-address-card',
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
            routerLinkActiveOptions: '{exact: true}',
            routerLink: ['/configuracao']
          });
      }
    }

    this.items.push(
      {
        label: 'Tarefa',
        icon: 'far fa-address-card',
        routerLinkActiveOptions: '{exact: true}',
        routerLink: ['/tarefa']
      });

    this.items.push(
      {
        label: 'Gráficos',
        icon: 'far fa-address-card',
        routerLinkActiveOptions: '{exact: true}',
        routerLink: ['/grafico']
      });

    this.items.push({label: 'Sair', icon: 'fas fa-sign-out-alt', command: () => { this.authenticationService.logout(); }, routerLink: ['login'], routerLinkActiveOptions: 'active'});
    return this.items;
  }


}

