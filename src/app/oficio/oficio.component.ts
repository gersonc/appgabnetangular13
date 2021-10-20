import {Component, OnDestroy, OnInit } from '@angular/core';
import { MostraMenuService } from '../_services';
import { OficioBuscaService } from './_services';
import { ArquivoService } from '../arquivo/_services';
import { CarregadorService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-oficio',
  templateUrl: './oficio.component.html',
  styleUrls: ['./oficio.component.css']
})
export class OficioComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  mostra = false;
  sub: Subscription[] = [];

  constructor(
    public mm: MostraMenuService,
    private obs: OficioBuscaService,
    private as: ArquivoService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {
    console.log('ofi 01');
    this.as.getPermissoes();
    this.obs.criarOficioBusca();
    if (!sessionStorage.getItem('oficio-busca')) {
      console.log('ofi 02');
      this.obs.buscaStateSN = false;
      this.mm.mudaMenu(true);
    } else {
      console.log('ofi 03');
      if (this.obs.buscaStateSN) {
        console.log('ofi 04');
        this.mm.mudaMenu(false);
      } else {
        console.log('ofi 05');
        this.mm.mudaMenu(true);
      }
    }
  }

  onHide() {
    this.mm.mudaMenu(false);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
