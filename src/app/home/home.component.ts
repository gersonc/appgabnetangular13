import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {AuthenticationService, UrlService} from '../_services';
import { User } from '../_models';
import { WindowsService } from '../_layout/_service';
import { CoordenadaXY } from '../_layout/_service/coordenada-x-y';
// import { HttpClient } from "@angular/common/http";
// import { Subscription } from "rxjs";
// import {take} from "rxjs/operators";
import {DispositivoService} from "../_services/dispositivo.service";
import { OnoffLineService } from "../shared/onoff-line/onoff-line.service";
// import {OnlineService} from "../_services/online.service";



@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  mostra = false;
  hst = location.hostname;
  // sub: Subscription[] = [];
  // deviceInfo: any = null;

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
    // public http: HttpClient,
    private urls: UrlService,
    public ol: OnoffLineService,
    // private ac: AppConfigService
    ) {
    this.currentUser = this.authenticationService.currentUser;
  }

  ngOnInit() {
    /*if (this.authenticationService.token !== undefined && this.authenticationService.token !== null && this.authenticationService.token.length > 5) {
      this.token = this.authenticationService.token.substring(0,30);
    }*/
    // this.ping();
    this.coorApp = this.ws.coorApp;
    this.coorTopo = this.ws.coorTopo;
    this.coorMain = this.ws.coorMain;
    this.coorRodape = this.ws.coorRodape;
    this.tela = this.getScreen();

    // this.authenticationService.dispositivo = 'mobile';
  }

  mostraMenu() {
    this.mostra = !this.mostra;
    this.authenticationService.mostraMenuEmiter(this.mostra);
  }


  /*ping() {
    this.sub.push(this.http.get(this.urls.ping).pipe(take(1)).subscribe({
      next: (data: any) => {
        this.ds.dispositivo = data.dispositivo;
      },
      error: (err) => console.log('ping-erro->', err)
    }));
  }*/

  mudaDispositivo() {
    if (this.ds.dispositivo !== 'mobile') {
      // this.ac.updateDispositivo('mobile');
      this.authenticationService.dispositivo = 'mobile';
      // this.ds.dispositivo = 'mobile';
    } else {
      this.authenticationService.dispositivo = 'desktop';
      // this.ac.updateDispositivo('desktop');
      // this.ds.dispositivo = 'desktop';
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
      // appCodeName: n.appCodeName,
      // product: n.product,
      // appVersion: n.appVersion,
      userAgent: n.userAgent,
      // platform: n.platform,
      onLine: n.onLine,
      hostname: w.location.hostname,
    };
  }

  ngOnDestroy() {
    // this.sub.forEach(s => s.unsubscribe());
  }

}

