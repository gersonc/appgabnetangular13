import { Component, OnInit } from '@angular/core';
import {MenuInternoService, MostraMenuService} from '../_services';
import { TelefoneBuscaService } from './_services';
import { DialogService } from 'primeng/dynamicdialog';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-telefone',
  templateUrl: './telefone.component.html',
  styleUrls: ['./telefone.component.css'],
  providers: [ DialogService ]
})
export class TelefoneComponent implements OnInit {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    private tbs: TelefoneBuscaService,
    public dialogService: DialogService,
  ) {
  }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.tbs.criarTelefoneBusca();
    if (!sessionStorage.getItem('telefone-busca')) {
      this.tbs.buscaStateSN = false;
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.tbs.buscaStateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
