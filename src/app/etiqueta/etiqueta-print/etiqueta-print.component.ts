import { Component, OnInit } from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {EtiquetaInterface} from "../_models";
import {EtiquetaService} from "../_services";
import {CadastroEtiquetaI} from "../_models/cadastro-etiqueta-i";
import {Linha, Tabela} from "../_models/etiqueta-print-i";
import {Celula} from "../_models/celula";

@Component({
  selector: 'app-etiqueta-print',
  templateUrl: './etiqueta-print.component.html',
  styleUrls: ['./etiqueta-print.component.css']
})
export class EtiquetaPrintComponent implements OnInit {

  etiquetas: CadastroEtiquetaI[] = [];
  tabelas: Tabela[] = [];
  linhas: Linha[] = []
  etq: EtiquetaInterface;
  etqPPag = 0;

  private etiqueta$: Observable<EtiquetaInterface>;
  private url: string;
  pw: any = null; // global variable
  sub: Subscription[] = [];
  previousURL = null;
  etq_folha_horz: number;
  etq_folha_vert: number;
  etq_margem_superior: number;
  etq_margem_lateral: number;
  etq_distancia_vertical: number;
  etq_distancia_horizontal: number;
  etq_altura: number;
  etq_largura: number;
  etq_linhas: number = 0;
  etq_colunas: number = 0;


  // cadastro: CadastroEtiquetaI[];
  pag: string;
  cel: string;
  esph: string;
  espv: string;
  texto: string;
  ht: any;
  cpo = '';
  etq_num: number;
  total = 0;
  public impEtiqueta = new Subject();
  impEtq$ = this.impEtiqueta.asObservable();

  constructor(
    public es: EtiquetaService
  ) { }

  ngOnInit(): void {

  }

  montaTabela() {
    this.etqPPag = this.etq.etq_linhas * this.etq.etq_colunas;
    const te = this.etiquetas.length;
    let ct = 0;
    let t = 0;
    let l = 0;
    let c = 0;
    while (this.etiquetas.length > 0) {
      let tb = new Tabela();
      t = 0;
      while (this.etqPPag > t) {
        let ln = new Linha();
        l = 0;
        while (this.etq.etq_linhas > l) {
          c = 0;
          while (this.etq.etq_colunas > c) {
            if (this.etiquetas.length > 0) {
              const cel = new Celula(this.etiquetas.shift());
              ln.push(cel);
            } else {
              const cel = new Celula(null);
              ln.push(cel);
            }
            ct++;
            c++;
          }
          tb.push(ln);
          l++;
        }
        this.tabelas.push(tb);
        t++;
      }
    }

  }

  // ${this.etq_altura}

  montaCelula(cadastro: CadastroEtiquetaI) {
    let str = ``;
    // ************ Pessoa Fisica
    if (cadastro.cadastro_tipo_tipo === 1) {
      str += `${cadastro.cadastro_tratamento_nome} <br> `;
      str += `${cadastro.cadastro_nome} <br> `;
      str += `${cadastro.cadastro_endereco}`;
      if (cadastro.cadastro_endereco_numero !== null) {
        str += `, ${cadastro.cadastro_endereco_numero}`;
      }
      if (cadastro.cadastro_endereco_complemento !== null) {
        str += ` ${cadastro.cadastro_endereco_complemento}`;
      }
      str += `<br>`;

      let nc = 0;
      if (cadastro.cadastro_bairro !== null) {
        nc += cadastro.cadastro_bairro.length;
      }
      if (nc > 0) {
        nc += cadastro.cadastro_municipio_nome.length + 2;
        if (nc <= 31) {
          str += `${cadastro.cadastro_bairro} `;
          str += `${cadastro.cadastro_municipio_nome} `;
          str += `${cadastro.cadastro_estado_nome} <br>`;
          str += `${cadastro.cadastro_cep}`;
        } else {
          str += `${cadastro.cadastro_bairro} <br> `;
          str += `${cadastro.cadastro_cep} `;
          str += `${cadastro.cadastro_municipio_nome} `;
          str += `${cadastro.cadastro_estado_nome}`;
        }
      } else {
        str += `${cadastro.cadastro_municipio_nome} `;
        str += `${cadastro.cadastro_estado_nome} <br> ${cadastro.cadastro_cep}`;
      }
    }
    // **************** Pessoa Juridica
    if (cadastro.cadastro_tipo_tipo === 2) {

      if (cadastro.cadastro_responsavel !== null) {
        if (cadastro.cadastro_tratamento_nome !== null) {
          str += `${cadastro.cadastro_tratamento_nome} <br> `;
          str += `${cadastro.cadastro_responsavel}<br>`;
        }
      }
      if (cadastro.cadastro_nome !== null) {
        str += `${cadastro.cadastro_nome} <br> `;
      }
      if (cadastro.cadastro_cargo !== null) {
        if (cadastro.cadastro_cargo !== 'PESSOA JURÍDICA') {
          str += `${cadastro.cadastro_cargo}<br>`;
        }
      }
      str += `${cadastro.cadastro_endereco}`;
      if (cadastro.cadastro_endereco_numero !== null) {
        str += `, ${cadastro.cadastro_endereco_numero}`;
      }
      if (cadastro.cadastro_endereco_complemento !== null) {
        str += ` ${cadastro.cadastro_endereco_complemento}`;
      }
      str += `<br>`;

      let nc = 0;
      if (cadastro.cadastro_bairro !== null) {
        nc += cadastro.cadastro_bairro.length;
      }
      if (nc > 0) {
        nc += cadastro.cadastro_municipio_nome.length + 2;
        if (nc <= 31) {
          str += `${cadastro.cadastro_bairro} `;
          str += `${cadastro.cadastro_municipio_nome} `;
          str += `${cadastro.cadastro_estado_nome} <br>`;
          str += `${cadastro.cadastro_cep}`;
        } else {
          str += `${cadastro.cadastro_bairro} <br> `;
          str += `${cadastro.cadastro_cep} `;
          str += `${cadastro.cadastro_municipio_nome} `;
          str += `${cadastro.cadastro_estado_nome}`;
        }
      } else {
        str += `${cadastro.cadastro_municipio_nome} `;
        str += `${cadastro.cadastro_estado_nome} <br> ${cadastro.cadastro_cep}`;
      }
    }
    return str;
  }

}
