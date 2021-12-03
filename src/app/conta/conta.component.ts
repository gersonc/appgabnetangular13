import { Component, OnInit } from '@angular/core';
import { ContaBuscaService } from './_services';
import {MenuInternoService, MostraMenuService} from "../_services";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    private tbs: ContaBuscaService
  ) { }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.tbs.criarContaBusca();
    if (!sessionStorage.getItem('conta-busca')) {
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
}
