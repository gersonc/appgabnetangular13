import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuInternoService} from "../../_services";
import {MensagemService} from "../_services/mensagem.service";
import {WindowsService} from "../../_layout/_service";
import {Subscription} from "rxjs";
import {LazyLoadEvent} from "primeng/api";

@Component({
  selector: 'app-mensagem-dataview',
  templateUrl: './mensagem-dataview.component.html',
  styleUrls: ['./mensagem-dataview.component.css']
})
export class MensagemDataviewComponent implements OnInit, OnDestroy {
  altura = `${WindowsService.altura - 170}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];


  constructor(
    public mi: MenuInternoService,
    public ms: MensagemService
  ) { }

  ngOnInit(): void {
    this.ms.criaTabela();
  }


  onLazyLoad(event: LazyLoadEvent): void {
    let ct = 0;
    if (this.ms.tabela.sortField !== event.sortField) {
      this.ms.tabela.sortField = event.sortField;
      ct++;
    }
    if (this.ms.tabela.first !== +event.first) {
      this.ms.tabela.first = +event.first;
      ct++;
    }
    if (event.rows !== undefined && this.ms.tabela.rows !== +event.rows) {
      this.ms.tabela.rows = +event.rows;
      ct++;
    }
    if (this.ms.tabela.sortOrder !== +event.sortOrder) {
      this.ms.tabela.sortOrder = +event.sortOrder;
      ct++;
    }
    if (ct > 0) {
      this.ms.lazy = true;
      this.ms.mensagemBusca();
    }
  }


  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
