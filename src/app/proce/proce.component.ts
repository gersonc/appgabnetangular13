import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {MenuInternoService} from "../_services";
import {ArquivoService} from "../arquivo/_services";
import {ProceService} from "./_services/proce.service";

@Component({
  selector: 'app-proce',
  templateUrl: './proce.component.html',
  styleUrls: ['./proce.component.css']
})
export class ProceComponent implements OnInit {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    public mi: MenuInternoService,
    private ps: ProceService,
    private as: ArquivoService,
  ) { }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('proce-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.ps.stateSN) {
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
    this.ps.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }
}
