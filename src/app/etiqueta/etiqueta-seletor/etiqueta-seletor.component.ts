import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { EtiquetaService } from '../_services';
import { Subscription } from 'rxjs';
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";
import {EtiquetaDropdownI} from "../_models/etiqueta-dropdown-i";
import {EtiquetaInterface} from "../_models";
import {EtiquetaCadastroService} from "../_services/etiqueta-cadastro.service";
import {WindowsService} from "../../_layout/_service";


@Component({
  selector: 'app-etiqueta-seletor',
  templateUrl: './etiqueta-seletor.component.html',
  styleUrls: ['./etiqueta-seletor.component.css']
})
export class EtiquetaSeletorComponent implements OnInit, OnDestroy {
  @Output() hideEtiqueta = new EventEmitter<boolean>();
  ddEtiqueta: EtiquetaDropdownI[] = [];
  etiqueta: EtiquetaInterface | null = null;
  etq_id: number;
  sub: Subscription[] = [];


  constructor(
    private dd: DdService,
    public etiquetaService: EtiquetaService,
    public ecs: EtiquetaCadastroService
  ) { }

  ngOnInit() {
    this.sub.push(this.etiquetaService.impEtiqueta.subscribe(() => {
        this.fechar();
      },
      () => {
      },
      () => {
      }
    ));
    if (!sessionStorage.getItem('dropdown-etiqueta')) {
      this.sub.push(this.dd.getDd('dropdown-etiqueta')
        .pipe(take(1))
        .subscribe((dados) => {
            sessionStorage.setItem('dropdown-etiqueta', JSON.stringify(dados));
          },
          (err) => console.error(err),
          () => {
            this.carregaDD();
          }
        )
      );
    } else {
      this.carregaDD();
    }
  }

  carregaDD() {
    this.ddEtiqueta = JSON.parse(sessionStorage.getItem('dropdown-etiqueta'));
  }

  imprimeEtiqueta(e: EtiquetaDropdownI) {
    this.ecs.mostraBtn = true;
    this.ecs.btnDesativado = false;
    this.etiqueta = {
      etq_id: e.etq_id,
      etq_marca: e.etq_marca,
      etq_modelo: e.etq_modelo,
      etq_margem_superior: e.etq_margem_superior,
      etq_margem_lateral: e.etq_margem_lateral,
      etq_distancia_vertical: e.etq_distancia_vertical,
      etq_distancia_horizontal: e.etq_distancia_horizontal,
      etq_altura: e.etq_altura,
      etq_largura: e.etq_largura,
      etq_linhas: e.etq_linhas,
      etq_colunas: e.etq_colunas,
      etq_folha_horz: e.etq_folha_horz,
      etq_folha_vert: e.etq_folha_vert
    };
    this.getPosicao();
    this.etiquetaService.etq = this.etiqueta;
  }

  implimir() {
    this.ecs.btnDesativado = true;
    this.ecs.btnClDesativado = true;
    this.etiquetaService.imprimirEtiqueta(this.etiqueta);
  }

  fechar() {
    this.hideEtiqueta.emit(true);
  }

  getPosicao() {
    const tela = WindowsService.getTela();
    this.etiquetaService.posicao = 'top=0,screenY=0,left='+Math.ceil((tela.largura / 2) - (this.etiqueta.etq_folha_horz * 2))+','+'screenX='+Math.ceil((tela.largura / 2) - (this.etiqueta.etq_folha_horz * 2))+',';
  }
t
  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    delete this.etiquetaService.posicao;
    delete this.ecs.cadastro;
    delete this.ecs.busca;
    delete this.ecs.tplistagem;
    delete this.ecs.tplistagemLabel;
    delete this.ecs.numEtqInicial;
    delete this.ecs.numEtqFinal;
  }

}
