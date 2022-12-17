import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {AuthenticationService, UrlService} from '../_services';
import { User } from '../_models';
import { CarregadorService } from '../_services';
import { WindowsService } from '../_layout/_service';
import { CoordenadaXY } from '../_layout/_service/coordenada-x-y';
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs";
import {take} from "rxjs/operators";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {DispositivoService} from "../_services/dispositivo.service";

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  mostra = false;
  hst = location.hostname;
  sub: Subscription[] = [];

  coorApp: CoordenadaXY;
  coorTopo: CoordenadaXY;
  coorMain: CoordenadaXY;
  coorRodape: CoordenadaXY;
  checked: boolean = this.authenticationService.dispositivo === 'mobile';
  token = '';

  constructor(
    private ds: DispositivoService,
    public authenticationService: AuthenticationService,
    public ws: WindowsService,
    public http: HttpClient,
    private urls: UrlService
    ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    if (this.authenticationService.token !== undefined && this.authenticationService.token !== null && this.authenticationService.token.length > 5) {
      this.token = this.authenticationService.token.substr(0,30);
    }
    this.ping();
    this.coorApp = this.ws.coorApp;
    this.coorTopo = this.ws.coorTopo;
    this.coorMain = this.ws.coorMain;
    this.coorRodape = this.ws.coorRodape;
    // this.authenticationService.dispositivo = 'mobile';
  }

  mostraMenu() {
    this.mostra = !this.mostra;
    this.authenticationService.mostraMenuEmiter(this.mostra);
  }


  ping() {
    this.sub.push(this.http.get(this.urls.ping).pipe(take(1)).subscribe({
      next: (data: any) => {
        this.authenticationService.dispositivo = data.dispositivo;
        this.ds.dispositivo = data.dispositivo;
      },
      error: (err) => console.log('ping-erro->', err)
    }));
  }

  mudaDispositivo() {
    if (this.authenticationService.dispositivo !== 'mobile') {
      this.authenticationService.dispositivo = 'mobile';
      this.ds.dispositivo = 'mobile';
    } else {
      this.authenticationService.dispositivo = 'desktop';
      this.ds.dispositivo = 'desktop';
    }
  }

  ngOnDestroy() {
    this.sub.forEach(s => s.unsubscribe());
  }

}

