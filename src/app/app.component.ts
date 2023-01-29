import {MenuDatatableService} from "./_services/menu-datatable.service";

declare global {
  interface Window {
    __VERSAOID__: number;
    __VERSAO__: any;
  }
}
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WindowsService } from './_layout/_service';
import { AuthenticationService, CarregadorService, Versao } from './_services';
import { ResizedEvent } from 'angular-resize-event';
import { CoordenadaXY } from './_layout/_service/coordenada-x-y';
import { ArquivoLoginService } from './arquivo/_services';
import { PrimeNGConfig } from 'primeng/api';
import { SpinnerService } from "./_services/spinner.service";
import { Spinkit } from 'ng-http-loader';
import {of, Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {Router} from "@angular/router";
import { AppConfig } from "./_models/appconfig";
import { AppConfigService } from "./_services/appconfigservice";
/*import {Message,MessageService} from 'primeng/api';
import {MsgService} from "./_services/msg.service";*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('principal', { static: true }) principal: ElementRef;

  title = 'app';
  public mostraMenuPrincipal = false;
  carregador = 'carregador';
  public carregadorSN = false;
  recarregamenu = false;
  // public spinkit = Spinkit;
  classe: string = null;
  // mobile = true;
  mostraPessoal = false;
  s: Subscription;
  appconfig: AppConfig;
  theme = "lara-light-blue";
  subscription: Subscription;

  /*private altura: number = WindowsService.nativeWindow.innerHeight;
  private largura: number = WindowsService.nativeWindow.innerWidth;
  public alturaMain: any;
  private currentUser: any;
  public parlamentarNome = '';
  public usuarioNome = '';*/


  private evs: CoordenadaXY[] = [];

  constructor(
    private config: PrimeNGConfig,
    public configService: AppConfigService,
    public authenticationService: AuthenticationService,
    private windowsService: WindowsService,
    private router: Router,
    private as: ArquivoLoginService,
    public md: MenuDatatableService,
    public sps: SpinnerService,

  ) {
    console.log('inicio 1');
  }

  ngOnInit() {
    console.log('inicio 2');
    window.__VERSAOID__ = +this.authenticationService.versao;
    window.__VERSAO__ = this.authenticationService.versao;
    let v = false;
    this.s = this.authenticationService.inicio()
      .pipe(take(1))
      .subscribe({
        next: (vf) => {
          if (vf) {
            v = vf;
          }
        },
        error: err => {
          console.error(err.message);
        },
        complete: () => {
          // this.unsubescreve();
          if (v) {
            this.configService.getConfig();
            if (this.authenticationService.permissoes_carregadas) {
              this.as.verificaPermissoes();
              this.mostraPessoal = true;
            }
          } else {
            this.router.navigate(['/login']);
          }
        }
      });

    this.appconfig = {theme: 'lara-light-blue', dark: false}

    this.subscription = this.configService.configUpdate$.subscribe( config => {
      const linkElement = document.getElementById('theme-link');
      this.replaceLink(linkElement, config.theme);
      this.appconfig = config;
    });

    this.configPrime();

    WindowsService.all();
  }


  replaceLink(linkElement, theme) {
    const id = linkElement.getAttribute('id');
    const cloneLinkElement = linkElement.cloneNode(true);

    cloneLinkElement.setAttribute('href', linkElement.getAttribute('href').replace(this.appconfig.theme, theme));
    cloneLinkElement.setAttribute('id', id + '-clone');

    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      linkElement.remove();
      cloneLinkElement.setAttribute('id', id);
    });
  }

  unsubescreve() {
    this.s.unsubscribe();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onResized(id: string, event: ResizedEvent): void {
    const ev = new CoordenadaXY();
    ev.oldX = event.oldRect?.width;
    ev.oldY = event.oldRect?.height;
    ev.x = event.newRect.width;
    ev.y = event.newRect.height;

    switch (id) {
      case 'app': {
        this.windowsService.coorApp = ev;
        this.windowsService.changeScreen(ev.x, ev.y);
        break;
      }
      case 'topo': {
        this.windowsService.coorTopo = ev;
        break;
      }
      case 'topo1': {
        this.windowsService.coorTopo = ev;
        break;
      }
      case 'main': {
        this.windowsService.coorMain = ev;
        break;
      }
      case 'rodape': {
        this.windowsService.coorRodape = ev;
        break;
      }
    }
  }

  public mostraEsconde(vf: boolean) {
      this.carregadorSN = vf;
  }

  configPrime() {
    this.config.setTranslation({
      'startsWith': 'Começa com',
      'contains': 'Contêm',
      'notContains': 'Não contém',
      'endsWith': 'Termina com',
      'equals': 'igual',
      'notEquals': 'Diferente de',
      'noFilter': 'Sem filtro',
      'lt': 'Menor que',
      'lte': 'Menor ou igual a',
      'gt': 'Maior que',
      'gte': 'Melhor, então ou igual',
      'is': 'É',
      'isNot': 'Não é',
      'before': 'Antes',
      'after': 'Depois',
      'clear': 'Limpar',
      'apply': 'Aplicar',
      'matchAll': 'Coincidir todos',
      'matchAny': 'Coincidir algum',
      'addRule': 'Adicionar Regra',
      'removeRule': 'Remover Regra',
      'accept': 'Sim',
      'reject': 'Não',
      'choose': 'Escolha',
      'upload': 'Upload',
      'cancel': 'Cancelar',
      'dayNames': ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      'dayNamesShort': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      'dayNamesMin': ['D', 'Se', 'Tr', 'Qa', 'Qi', 'Sx', 'Sb'],
      'monthNames': ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', ' Dezembro'],
      'monthNamesShort': ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', ' Dez '],
      'today': 'Hoje',
      'weekHeader': 'Sm',
      'emptyMessage': 'Sem resultados',
      "weak": 'Fraca',
      "medium": 'Media',
      "strong": 'Forte',
      "passwordPrompt": 'Entre com a senha',
      "emptyFilterMessage": 'Sem resultados encontrados'
    });
    this.config.ripple = true;
  }

  abreFechaMenu() {
    this.mostraMenuPrincipal = !this.mostraMenuPrincipal;
  }

  abreFechaMd() {
    this.md.mdt = !this.md.mdt;
  }
}

