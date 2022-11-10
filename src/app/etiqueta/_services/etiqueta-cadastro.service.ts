import { Injectable } from '@angular/core';
import {CadastroEtiquetaI} from "../_models/cadastro-etiqueta-i";
import {CadastroI} from "../../cadastro/_models/cadastro-i";
import {CadastroBuscaI} from "../../cadastro/_models/cadastro-busca-i";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "../../_services";

@Injectable({
  providedIn: 'root'
})
export class EtiquetaCadastroService {
  cadastro: CadastroEtiquetaI[] = [];
  busca: CadastroBuscaI | null = null;
  tplistagem = 0;
  tplistagemLabel: string | null = null;
  numEtqInicial = 0;
  numEtqFinal = 0;
  btnDesativado = true;
  btnClDesativado = false;
  mostraBtn = false;

  constructor(
    private urlService: UrlService,
    private http: HttpClient,
  ) { }


  parceEtiquetas(c: CadastroI[]) {
    this.numEtqInicial = c.length;
    this.cadastro = c.filter( cd => (
      cd.cadastro_endereco !== null &&
      cd.cadastro_endereco.length > 3 &&
      cd.cadastro_cep !== null &&
      cd.cadastro_cep.length >= 8 &&
      cd.cadastro_cep.length <= 9
    )).map(d => {
      return {
        cadastro_id: d.cadastro_id,
        cadastro_tipo_tipo: d.cadastro_tipo_tipo,
        cadastro_nome: d.cadastro_nome,
        cadastro_endereco: d.cadastro_endereco,
        cadastro_endereco_numero: this.limpaTxt(d.cadastro_endereco_numero),
        cadastro_endereco_complemento: this.limpaTxt(d.cadastro_endereco_complemento),
        cadastro_bairro: this.limpaTxt(d.cadastro_bairro),
        cadastro_municipio_nome: d.cadastro_municipio_nome,
        cadastro_cep: (d.cadastro_cep.length === 8) ? d.cadastro_cep.substr(0,5) + '-' + d.cadastro_cep.substr(5,3): d.cadastro_cep,
        cadastro_estado_nome: d.cadastro_estado_nome,
        cadastro_responsavel: this.limpaTxt(d.cadastro_responsavel),
        cadastro_tratamento_nome: d.cadastro_tratamento_nome,
        cadastro_cargo: this.limpaTxt(d.cadastro_cargo),
        cadastro_sigilo2: d.cadastro_sigilo2
      }
    });
    this.numEtqFinal = this.cadastro.length;

  }

  limpaTxt(s: string | null): string | null {
    if (s === null) {
      return null;
    }
    if (s.length === 0) {
      return null;
    }
    if (s === '.' || s === ',' || s === ';') {
      return null;
    }
    return s.toUpperCase();

  }

  getTpListagemLabel(n: number) {
    switch (n) {
      case 1:
        this.tplistagemLabel = 'SELECIONADOS';
        break;
      case 2:
        this.tplistagemLabel = 'PÁGINA';
        break;
      case 3:
        this.tplistagemLabel = 'TODOS';
        break;
    }
  }

  postEtiquetas() {
    const url = this.urlService.cadastro + '/listaretiqueta3';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<CadastroEtiquetaI[]>(url, this.busca, httpOptions);
  }
}
