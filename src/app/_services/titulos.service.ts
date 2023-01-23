import { Injectable } from '@angular/core';
import {ITitulos, Mtitulos, TituloI, TituloMinI, TitulosI} from "../_models/titulo-i";
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})

export class TitulosService {
  modulo: string | null = null;
  resp: TitulosI[] = [] ;
  titulosi: TitulosI[] = [];
  titulos: TituloI[] = [];
  campos: string[] = [];
  todosTitulos = {
    t: [],
    tt: null,
    ttt: null
  }

  iTitulos: ITitulos[] = [];

  mTitulo: Mtitulos[] = [];

  constructor(private httpClient: HttpClient) { }

  loadTitulos() {
     return this.httpClient.get<TitulosI[]>("assets/titulos.json");
  }

  carregaTitulos(modulo: string, cps: string[] = []): TituloI[] {
    this.modulo = modulo;
    if (this.titulosi === undefined || this.titulosi === null || ( Array.isArray(this.titulosi) && this.titulosi.length === 0)) {
      this.loadTitulos().pipe(take(1)).subscribe((dados) => {
        this.titulosi = dados;
        const c = Object.keys(dados)
        this.titulos = c.map(s => { return dados[s]});
        this.mTitulo[modulo] = cps.map(c => {
          return (this.titulosi[c] !== undefined) ? this.titulosi[c] : {field: c, mtitulo: 'N/F', titulo: 'N/F'};
        });
      });
      return this.mTitulo[modulo];
    } else {
      if (this.mTitulo[modulo] === undefined) {
        this.mTitulo[modulo] = cps.map(c => {
          return (this.titulosi[c] !== undefined) ? this.titulosi[c] : {field: c, mtitulo: 'N/F', titulo: 'N/F'};
        });
        return this.mTitulo[modulo];
      } else {
        return this.mTitulo[modulo];
      }
    }
  }

  buscaTitulos(modulo: string, cps: string[] = []): TituloI[] {
    if (cps.length > 0) {
      if (this.titulos === undefined || this.titulos === null || (Array.isArray(this.titulos) && this.titulos.length === 0)) {
        return this.carregaTitulos(modulo, cps);
      } else {
        if (this.mTitulo[modulo] === undefined || this.mTitulo[modulo] === null || (Array.isArray(this.mTitulo[modulo]) && this.mTitulo[modulo].length === 0)) {
          return this.carregaTitulos(modulo, cps);
        } else {
          return this.mTitulo[modulo];
        }
      }
    } else {
      return [];
    }
  }

  getITitulos(modulo: string, cps: string[]): TitulosI {
    if (this.iTitulos[modulo] !== undefined) {
      return this.iTitulos[modulo];
    }
    this.iTitulos[modulo] = {};
    cps.forEach(cp => {
      if (this.titulosi[cp] !== undefined) {
        this.iTitulos[modulo][cp] = this.titulosi[cp];
      } else {
        this.iTitulos[modulo][cp] = {
          field: cp,
          mtitulo: 'N/F',
          titulo: 'N/F'
        };
      }
    });
    return this.iTitulos[modulo];
  }

  /*buscaTitulos2(modulo: string, cps: string[] = []) {
    if (this.titulos2.length === 0) {
      this.loadTitulos().pipe(take(1)).subscribe((dados) => {
        this.titulos2 = dados;
        this.mTitulo[modulo] = cps.map(c => {
          return this.titulos2[c];
        });
      })
    } else {
      if (this.mTitulo[modulo] === undefined) {
        this.mTitulo[modulo] = cps.map(c => {
          return [c] = this.titulos2[c];
        });
      }
    }
  }*/

  buscaTitulosDetalhe(modulo: string, cps: string[] = []): TituloMinI[] {
    if (this.mTitulo[modulo] === undefined || this.mTitulo[modulo] === null || (Array.isArray(this.mTitulo[modulo]) && this.mTitulo[modulo].length === 0)) {
      // let r: TitulosI[] = this.mTitulo[modulo];
      return cps.map(c => {
        return [c] = this.mTitulo[modulo][c].mtitulo;
        // return t;
      });
    }
    /*let rs: TituloI[] = [];
    cps.forEach(c => {
      if (this.titulos[c] !== undefined) {
        rs[c] = this.titulos[c].mtitulo;
      }
    })
    return rs;*/
  }

  buscaTitulosRelatorio(modulo: string, cps: string[]): string[] {
    if (this.mTitulo[modulo] === undefined || this.mTitulo[modulo] === null || (Array.isArray(this.mTitulo[modulo]) && this.mTitulo[modulo].length === 0)) {
      // let r: TitulosI[] = this.mTitulo[modulo];
      return cps.map(c => {
        return this.mTitulo[modulo][c].mtitulo;
        // return t;
      });
    }



    /*let rs: string[] = [];
    cps.forEach(c => {
      if (this.titulos[c] !== undefined) {
        rs[c] = this.titulos[c].mtitulo;
      }
    })
    return rs;*/
  }

  buscaTitulosRelatorio2(cps: string[]): string[] {
    const rs: string[] = [];
    cps.forEach(c => {
      if (this.titulos[c] !== undefined) {
        rs[c] = this.titulos[c].mtitulo;
      }
    })
    return rs;
  }

  getTodos() {
    this.loadTitulos().pipe(take(1)).subscribe((dados) => {
      this.todosTitulos.t = Object.values(dados);
      this.todosTitulos.tt = this.titulos;
      this.todosTitulos.ttt = dados;
    });
  }

  getTudo(): any {
    return this.todosTitulos;
  }

  teste() {
    const cps = [
      'processo_numero',
      'processo_status_nome',
      'solicitacao_situacao',
      'cadastro_tipo_nome',
      'cadastro_nome',
      'cadastro_endereco',
      'cadastro_endereco_numero',
      'cadastro_endereco_complemento',
      'cadastro_bairro',
      'cadastro_municipio_nome',
      'cadastro_regiao_nome',
      'cadastro_cep',
      'cadastro_estado_nome',
      'cadastro_telefone',
      'cadastro_telefone2',
      'cadastro_telcom',
      'cadastro_celular',
      'cadastro_celular2',
      'cadastro_fax',
      'cadastro_email',
      'cadastro_email2',
      'cadastro_rede_social',
      'cadastro_outras_midias',
      'cadastro_data_nascimento',
      'solicitacao_data',
      'solicitacao_assunto_nome',
      'solicitacao_area_interesse_nome',
      'solicitacao_indicacao_sn',
      'solicitacao_indicacao_nome',
      'solicitacao_orgao',
      'solicitacao_local_nome',
      'solicitacao_tipo_recebimento_nome',
      'solicitacao_descricao',
      'solicitacao_aceita_recusada',
      'oficio_codigo',
      'oficio_numero',
      'oficio_prioridade_nome',
      'oficio_convenio',
      'oficio_data_emissao',
      'oficio_data_recebimento',
      'oficio_orgao_solicitado_nome',
      'oficio_descricao_acao',
      'oficio_data_protocolo',
      'oficio_protocolo_numero',
      'oficio_orgao_protocolante_nome',
      'oficio_protocolante_funcionario',
      'oficio_prazo',
      'oficio_tipo_andamento_nome',
      'oficio_status_nome',
      'oficio_valor_solicitado',
      'oficio_valor_recebido',
      'oficio_data_pagamento',
      'oficio_data_empenho',
      'historico_data',
      'historico_andamento',
      'historico_solicitacao_data',
      'historico_solicitacao_andamento'
    ];
    console.log('teste1', this.titulosi);
    const r: any[] = cps.map(c => {
      return [c, (this.titulosi[c] === undefined)];
    });
    console.log('teste', r);
  }

  OnDestroy() {
    this.campos = [];
    this.mTitulo[this.modulo] = [];
  }

}
