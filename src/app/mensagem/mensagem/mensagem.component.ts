import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuInternoService} from "../../_services";
import {Subscription} from "rxjs";
import {MensagemService} from "../_services/mensagem.service";

@Component({
  selector: 'app-mensagem',
  templateUrl: './mensagem.component.html',
  styleUrls: ['./mensagem.component.css']
})
export class MensagemComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];
  constructor(
    public mi: MenuInternoService,
    public ms: MensagemService
  ) { }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  ngOnDestroy(): void {
    this.ms.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }

}
