import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { AuthenticationService } from '../_services';
import { User } from '../_models';
import { CarregadorService } from '../_services';
import { WindowsService } from '../_layout/_service';
import { CoordenadaXY } from '../_layout/_service/coordenada-x-y';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  currentUser: User;
  mostra = false;

  coorApp: CoordenadaXY;
  coorTopo: CoordenadaXY;
  coorMain: CoordenadaXY;
  coorRodape: CoordenadaXY;

  constructor(
    private authenticationService: AuthenticationService,
    private cs: CarregadorService,
    public ws: WindowsService
    ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
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

}

