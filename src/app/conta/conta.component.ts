import { Component, OnInit } from '@angular/core';
import { MostraMenuService } from '../util/_services';
import { ContaBuscaService } from './_services';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {
  public altura = (window.innerHeight - 170) + 'px';

  constructor(
    public mm: MostraMenuService,
    private tbs: ContaBuscaService
  ) { }

  ngOnInit() {
    this.tbs.criarContaBusca();
    if (!sessionStorage.getItem('conta-busca')) {
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
