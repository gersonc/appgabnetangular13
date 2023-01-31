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
import { DomHandler } from "primeng/dom";
import { AutenticacaoService } from "./_services/autenticacao.service";
import { AutorizaService } from "./_services/autoriza.service";
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
  appconfig: AppConfig = {
    usuario_uuid: null,
    theme: "lara-light-blue",
    dark: false,
    inputStyle: "outlined",
    ripple: true,
    scale: '14px', // px
    dispositivo: "desktop"
  };
  theme = "lara-light-blue";
  subscription: Subscription;

  ct = 0;
  pt = 0;
  tt = 0;
  gg = 0;

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
    private atz: AutorizaService,
    public authenticationService: AuthenticationService,
    private aut: AutenticacaoService,
    private windowsService: WindowsService,
    private router: Router,
    public md: MenuDatatableService,
    public sps: SpinnerService,

  ) {
    console.log('inicio 1');
    this.atz.logado$.subscribe({
      next: (vf) => {
        this.tt++;
        console.log('AppComponent logado$', vf, this.tt);
        if (vf) {
          this.mostraPessoal = true;
          this.configService.getConfig();
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  ngOnInit() {
    console.log('inicio 2');
    this.subscription = this.configService.configUpdate$.subscribe( config => {
      this.ct++;
      console.log("ct", this.ct);
      this.updateAppConfig(config);
    });

    // let ss: Subscription =
      this.atz.reflesh.subscribe({
      next: (vf) => {
        console.log('AppComponent reflesh', vf, this.gg);
        if (vf) {
          this.aut.getRefleh();
        } else {
          this.router.navigate(['/login']);
        }
      }
    });

    // let sss: Subscription =
      /*this.atz.logado$.subscribe({
      next: (vf) => {
        this.tt++;
        console.log('AppComponent logado$', vf, this.tt);
        if (vf) {
          this.mostraPessoal = true;
          this.configService.getConfig();
        } else {
          this.router.navigate(['/login']);
        }
      }
    });*/


    // this.appconfig = this.configService.getConfig();

    /*let v = false;
    this.s = this.authenticationService.inicio()
      .pipe(take(1))
      .subscribe({
        next: (vf) => {
          console.log('init', vf);
          if (vf) {
            v = vf;
          }
        },
        error: err => {
          console.error(err.message);
        },
        complete: () => {
          console.log('init', v);
          // this.unsubescreve();
          if (v) {
            this.configService.getConfig();
            if (this.authenticationService.permissoes_carregadas) {


            }
          } else {
            this.router.navigate(['/login']);
          }
        }
      });*/

    window.__VERSAOID__ = +this.authenticationService.versao;
    window.__VERSAO__ = this.authenticationService.versao;
    /*this.subscription = this.configService.configUpdate$.subscribe( config => {
      this.ct++;
      console.log("ct", this.ct);
      this.updateAppConfig(config);
    });*/

    this.configPrime();

    WindowsService.all();
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

  updateAppConfig(c: AppConfig) {
    console.log("pt", this.pt);
    /*if (c.theme !== this.appconfig.theme) {
      const linkElement = document.getElementById('theme-link');
      this.replaceLink(linkElement, c.theme);
    }*/
    if (c.ripple !== this.appconfig.ripple) {
      this.rippleChange(c.ripple);
    }
    /*if (c.dark !== this.appconfig.dark) {
      this.darkChange(c.dark);
    }*/
   /* console.log("this.appconfig.scale", this.appconfig.scale);
    console.log("c.scale !== this.appconfig.scale", (c.scale !== this.appconfig.scale));*/

    if (c.inputStyle !== this.appconfig.inputStyle) {
      this.inputStyleChange(c.inputStyle);
    }
    this.appconfig = c;
    this.configService.setConfig(c);
    console.log('this.appconfig', this.appconfig);
  }



  rippleChange(vf: boolean) {
    if (vf) {
      DomHandler.removeClass(document.body, 'p-ripple-disabled');
    } else {
      DomHandler.addClass(document.body, 'p-ripple-disabled');
    }
  }

  /*darkChange(vf: boolean) {
    let theme = this.appconfig.theme;
    theme = vf ? theme.replace("light", "dark") :  theme.replace("dark", "light");
      this.appconfig = { ...this.appconfig, dark: vf, theme: theme };
      const linkElement = document.getElementById('theme-link');
      this.replaceLink(linkElement, theme);
  }

  isDarkTheme(theme): boolean {
    return theme.indexOf('dark') !== -1 || theme.indexOf('vela') !== -1 || theme.indexOf('arya') !== -1 || theme.indexOf('luna') !== -1;
  }*/

  inputStyleChange(s: string) {
    if (s === 'filled') {
      DomHandler.addClass(document.body, 'p-input-filled');
    } else {
      DomHandler.removeClass(document.body, 'p-input-filled');
    }
  }

  abreFechaMd() {
    this.md.mdt = !this.md.mdt;
  }
}

