import { Component, OnInit } from '@angular/core';
import { MostraMenuService } from '../_services';
import { ArquivoService } from '../arquivo/_services';
import { EmendaBuscaService } from './_services';

@Component({
  selector: 'app-emenda',
  templateUrl: './emenda.component.html',
  styleUrls: ['./emenda.component.css']
})
export class EmendaComponent implements OnInit {
  public altura = (window.innerHeight - 170) + 'px';

  constructor(
    public mm: MostraMenuService,
    private as: ArquivoService,
    public ebs: EmendaBuscaService
  ) { }

  ngOnInit(): void {
    this.as.getPermissoes();
    this.ebs.criarEmendaBusca();
    if (!sessionStorage.getItem('emenda-busca')) {
      this.ebs.buscaStateSN = false;
      this.mm.mudaMenu(true);
    } else {
      if (this.ebs.buscaStateSN) {
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
