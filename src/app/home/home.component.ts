import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {AuthenticationService, UrlService} from '../_services';
import { User } from '../_models';
import { WindowsService } from '../_layout/_service';
import { CoordenadaXY } from '../_layout/_service/coordenada-x-y';
import {DispositivoService} from "../_services/dispositivo.service";
import { OnoffLineService } from "../shared/onoff-line/onoff-line.service";



@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  mostra = false;
  hst = location.hostname;

  coorApp: CoordenadaXY;
  coorTopo: CoordenadaXY;
  coorMain: CoordenadaXY;
  coorRodape: CoordenadaXY;
  checked: boolean = this.ds.dispositivo === 'mobile';
  token = '';
  tela: any = null;

  constructor(
    public ds: DispositivoService,
    public authenticationService: AuthenticationService,
    public ws: WindowsService,
    private urls: UrlService,
    public ol: OnoffLineService,
    ) {
    this.currentUser = this.authenticationService.currentUser;
  }

  ngOnInit() {
    this.coorApp = this.ws.coorApp;
    this.coorTopo = this.ws.coorTopo;
    this.coorMain = this.ws.coorMain;
    this.coorRodape = this.ws.coorRodape;
    this.tela = this.getScreen();
  }

  mostraMenu() {
    this.mostra = !this.mostra;
    this.authenticationService.mostraMenuEmiter(this.mostra);
  }


  mudaDispositivo() {
    if (this.ds.dispositivo !== 'mobile') {
      this.authenticationService.dispositivo = 'mobile';
    } else {
      this.authenticationService.dispositivo = 'desktop';
    }
  }




  getScreen() {
    const w = WindowsService.nativeWindow;
    const m = w.screen;
    const n = w.navigator;

    return  {
      height:m.height,
      width: m.width,
      innerWidth: w.innerWidth,
      innerHeight: w.innerHeight,
      availWidth: m.availWidth,
      availHeight: m.availHeight,
      pixelDepth: m.pixelDepth,
      colorDepth: m.colorDepth,
      userAgent: n.userAgent,
      onLine: n.onLine,
      hostname: w.location.hostname,
    };
  }

  ngOnDestroy() {
    // this.sub.forEach(s => s.unsubscribe());
  }

}

