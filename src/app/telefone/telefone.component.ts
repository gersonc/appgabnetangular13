import { Component, OnInit } from '@angular/core';
import { MostraMenuService } from '../_services';
import { TelefoneBuscaService } from './_services';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-telefone',
  templateUrl: './telefone.component.html',
  styleUrls: ['./telefone.component.css'],
  providers: [ DialogService ]
})
export class TelefoneComponent implements OnInit {
  public altura = (window.innerHeight - 170) + 'px';

  constructor(
    public mm: MostraMenuService,
    private tbs: TelefoneBuscaService,
    public dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.tbs.criarTelefoneBusca();
    if (!sessionStorage.getItem('telefone-busca')) {
      this.tbs.buscaStateSN = false;
      this.mm.mudaMenu(true);
    } else {
      if (this.tbs.buscaStateSN) {
        this.mm.mudaMenu(false);
      } else {
        this.mm.mudaMenu(true);
      }
    }
  }

  onHide() {
    this.mm.mudaMenu(false);
  }
}
