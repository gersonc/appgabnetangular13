import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuInternoService } from '../_services';
import { ArquivoService } from '../arquivo/_services';
import { EmendaBuscaService } from './_services';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-emenda',
  templateUrl: './emenda.component.html',
  styleUrls: ['./emenda.component.css']
})
export class EmendaComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    public mi: MenuInternoService,
    private as: ArquivoService,
    public ebs: EmendaBuscaService
  ) { }

  ngOnInit(): void {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    this.ebs.criarEmendaBusca();
    if (!sessionStorage.getItem('emenda-busca')) {
      this.ebs.buscaStateSN = false;
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.ebs.buscaStateSN) {
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
