import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {MenuInternoService} from "../_services";
import {ArquivoService} from "../arquivo/_services";
import {OficioService} from "./_services/oficio.service";

@Component({
  selector: 'app-oficio',
  templateUrl: './oficio.component.html',
  styleUrls: ['./oficio.component.css']
})
export class OficioComponent implements OnInit {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    public mi: MenuInternoService,
    private os: OficioService,
    private as: ArquivoService,
  ) { }

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
      if (this.os.stateSN) {
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
    this.os.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }

}
