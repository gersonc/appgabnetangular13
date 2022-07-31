import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {MenuInternoService} from "../_services";
import {ArquivoService} from "../arquivo/_services";
import {EmendaService} from "./_services/emenda.service";

@Component({
  selector: 'app-emenda',
  templateUrl: './emenda.component.html',
  styleUrls: ['./emenda.component.css']
})
export class EmendaComponent implements OnInit, OnInit {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    public mi: MenuInternoService,
    private as: ArquivoService,
    public es: EmendaService
  ) {
  }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('solic-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.es.stateSN) {
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
    this.es.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }
}
