import { Injectable } from '@angular/core';
import {CadastroEtiquetaI} from "../../cadastro/_models/cadastro-etiqueta-i";
import {CadastroI} from "../../cadastro/_models/cadastro-i";

@Injectable({
  providedIn: 'root'
})
export class EtiquetaCadastroService {
  cadastro: CadastroEtiquetaI[] = [];
  constructor() { }


  parceEtiquetas(c: CadastroI[]) {
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
        cadastro_endereco_numero: d.cadastro_endereco_numero,
        cadastro_endereco_complemento: d.cadastro_endereco_complemento,
        cadastro_bairro: d.cadastro_bairro,
        cadastro_municipio_nome: d.cadastro_municipio_nome,
        cadastro_cep: (d.cadastro_cep.length === 8) ? d.cadastro_cep.substring(0,5) + '-' + d.cadastro_cep.substring(5,3): d.cadastro_cep,
        cadastro_estado_nome: d.cadastro_estado_nome,
        cadastro_responsavel: d.cadastro_responsavel,
        cadastro_tratamento_nome: d.cadastro_tratamento_nome,
        cadastro_cargo: d.cadastro_cargo
      }
    });
  }
}
