import { Component, OnInit } from '@angular/core';
import { MostraMenuService } from '../util/_services';
import { PassagemBuscaService } from './_services';

@Component({
  selector: 'app-passagem',
  templateUrl: './passagem.component.html',
  styleUrls: ['./passagem.component.css']
})
export class PassagemComponent implements OnInit {
  public altura = (window.innerHeight - 170) + 'px';

  constructor(
    public mm: MostraMenuService,
    private tbs: PassagemBuscaService
  ) { }

  ngOnInit() {
    this.tbs.criarPassagemBusca();
    if (!sessionStorage.getItem('passagem-busca')) {
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
