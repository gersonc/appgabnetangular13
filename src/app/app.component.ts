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

  classe: string = null;
  mobile = true;

  /*private altura: number = WindowsService.nativeWindow.innerHeight;
  private largura: number = WindowsService.nativeWindow.innerWidth;
  public alturaMain: any;
  private currentUser: any;
  public parlamentarNome = '';
  public usuarioNome = '';*/


  private evs: CoordenadaXY[] = [];

  constructor(
    private config: PrimeNGConfig,
    public authenticationService: AuthenticationService,
    private windowsService: WindowsService,
    public cs: CarregadorService,
    private as: ArquivoLoginService,
    public md: MenuDatatableService
  ) { }

  ngOnInit() {
    window.__VERSAOID__ = +this.authenticationService.versao_id;
    window.__VERSAO__ = this.authenticationService.versao;
    if (this.authenticationService.dispositivo !== 'mobile') {
      // this.classe = 'mobile';
      this.mobile = true;
    }
    this.configPrime();

    this.cs.getCarregador().subscribe(vf => {
      this.mostraEsconde(vf);
    });

    if (this.authenticationService.permissoes_carregadas) {
       this.as.verificaPermissoes();
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
      'weekHeader': 'Sm'
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

