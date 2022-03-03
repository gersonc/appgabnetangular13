import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {AuthenticationService, UrlService} from '../_services';
import { User } from '../_models';
import { CarregadorService } from '../_services';
import { WindowsService } from '../_layout/_service';
import { CoordenadaXY } from '../_layout/_service/coordenada-x-y';
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";

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

  constructor(
    private authenticationService: AuthenticationService,
    private cs: CarregadorService,
    public ws: WindowsService,
    public http: HttpClient,
    private urls: UrlService
    ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.ping();
    this.coorApp = this.ws.coorApp;
    this.coorTopo = this.ws.coorTopo;
    this.coorMain = this.ws.coorMain;
    this.coorRodape = this.ws.coorRodape;
  }

  mostraMenu() {
    this.mostra = !this.mostra;
    this.authenticationService.mostraMenuEmiter(this.mostra);
  }

  mostraCarregador() {
    this.cs.mostraEscondeCarregador(true);
  }

  escondeCarregador() {
    this.cs.mostraEscondeCarregador(false);
  }

  ping() {
    this.sub.push(this.http.get(this.urls.ping).subscribe(
      (data) => console.log('ping->', data),
      (err) => console.log('ping-erro->',err)
    ));
  }

  ngOnDestroy() {
    this.sub.forEach(s => s.unsubscribe());
  }

}

