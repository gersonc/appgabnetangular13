// import {Celula} from "./celula";
import {CadastroEtiquetaI} from "./cadastro-etiqueta-i";
// import {EtiquetaCelula} from "./etiqueta-celula";

export class Celula {
  celula: CadastroEtiquetaI | null= null;

  constructor(
    x?: CadastroEtiquetaI | null
  ) {
    this.celula = EtiquetaCelula.montaCelula(x);
  }

}


export interface LinhaI {
  celulas: any[];

  /*
    constructor(c?: [] | Celula | Celula[] | null) {
      this.celulas = c;


  /*


    public add (c: Celula) {
      this._celulas.push(c);
    }

    push (c?: [] | Celula | Celula[] | null) {
      if (c === undefined || c === [] || c === null ) {
        this._celulas = null;
      } else {
        if(Array.isArray(c)) {
          this._celulas.push(...c);
        } else {
          this._celulas.push(c);
        }
      }
    }

    public set celula(c: undefined | [] | Celula | Celula[] | null) {
      if (c === undefined || c === [] || c === null ) {
        this._celulas = null;
      } else {
        if(Array.isArray(c)) {
          this._celulas.push(...c);
        } else {
          this._celulas.push(c);
        }
      }
    }

    public lenght(): number {
      return (this._celulas === null || this._celulas.length === 0) ? 0 : this._celulas.length;
    }

    public get celula(): Celula[] {
      return this._celulas;
    }
  */


}



export interface TabelaI {
  linhas: LinhaI[] | null;


/*


  constructor(c?: [] | Linha | Linha[] | null) {
    this.linhas = c;
  }

  public add (c: Linha) {
    this._linhas.push(c);
  }

  public push (c?: [] | Linha | Linha[] | null) {
    if (c === undefined || c === [] || c === null ) {
      this._linhas = null;
    } else {
      if(Array.isArray(c)) {
        this._linhas.push(...c);
      } else {
        this._linhas.push(c);
      }
    }
  }

  public set linhas(c: undefined | [] | Linha | Linha[] | null) {
    if (c === undefined || c === [] || c === null ) {
      this._linhas = null;
    } else {
      if(Array.isArray(c)) {
        this._linhas.push(...c);
      } else {
        this._linhas.push(c);
      }
    }
  }

  public get lenght(): number {
    return (this._linhas === null || this._linhas.length === 0) ? 0 : this._linhas.length;
  }

  public get linhas(): Linha[] {
    return this._linhas;
  }

*/

}

export class EtiquetaCelula {

  public static montaCelula(cadastro?: CadastroEtiquetaI | null): any  {
    if (cadastro === undefined || cadastro === null) {
      return '';
    }
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
        if (cadastro.cadastro_cargo !== 'PESSOA JUR??DICA') {
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

  public static montaCelula2 (cadastro: CadastroEtiquetaI) {
    let str = '';
    // ************ Pessoa Fisica
    if (cadastro.cadastro_tipo_tipo === 1) {
      str += cadastro.cadastro_tratamento_nome + '<br>';
      str += cadastro.cadastro_nome + '<br>';
      str += cadastro.cadastro_endereco;
      if (cadastro.cadastro_endereco_numero !== null) {
        str += ',' + cadastro.cadastro_endereco_numero;
      }
      if (cadastro.cadastro_endereco_complemento !== null) {
        str += ' ' + cadastro.cadastro_endereco_complemento;
      }
      str += '<br>';

      let nc = 0;
      if (cadastro.cadastro_bairro !== null) {
        nc += cadastro.cadastro_bairro.length;
      }
      if (nc > 0) {
        nc += cadastro.cadastro_municipio_nome.length + 2;
        if (nc <= 31) {
          str += cadastro.cadastro_bairro + '  ';
          str += cadastro.cadastro_municipio_nome + '  ';
          str += cadastro.cadastro_estado_nome + '<br>';
          str += cadastro.cadastro_cep;
        } else {
          str += cadastro.cadastro_bairro + '<br>';
          str += cadastro.cadastro_cep + '  ';
          str += cadastro.cadastro_municipio_nome + ' ';
          str += cadastro.cadastro_estado_nome;
        }
      } else {
        str += cadastro.cadastro_municipio_nome + '  ';
        str += cadastro.cadastro_estado_nome + '<br>' + cadastro.cadastro_cep;
      }
    }
    // **************** Pessoa Juridica
    if (cadastro.cadastro_tipo_tipo === 2) {

      if (cadastro.cadastro_responsavel !== null) {
        if (cadastro.cadastro_tratamento_nome !== null) {
          str += cadastro.cadastro_tratamento_nome.length + '<br>';
          str += cadastro.cadastro_responsavel + '<br>';
        }
      }
      if (cadastro.cadastro_nome !== null) {
        str += cadastro.cadastro_nome + '<br>';
      }
      if (cadastro.cadastro_cargo !== null) {
        if (cadastro.cadastro_cargo !== 'PESSOA JUR??DICA') {
          str += cadastro.cadastro_cargo + '<br>';
        }
      }
      str += cadastro.cadastro_endereco;
      if (cadastro.cadastro_endereco_numero !== null) {
        str += ',' + cadastro.cadastro_endereco_numero;
      }
      if (cadastro.cadastro_endereco_complemento !== null) {
        str += ' ' + cadastro.cadastro_endereco_complemento;
      }
      str += '<br>';
      let nc = 0;
      if (cadastro.cadastro_bairro !== null) {
        nc += cadastro.cadastro_bairro.length;
      }
      if (nc > 0) {
        nc += cadastro.cadastro_municipio_nome.length + 2;
        if (nc <= 31) {
          str += cadastro.cadastro_bairro + '  ';
          str += cadastro.cadastro_municipio_nome + '  ';
          str += cadastro.cadastro_estado_nome + '<br>';
          str += cadastro.cadastro_cep;
        } else {
          str += cadastro.cadastro_bairro + '<br>';
          str += cadastro.cadastro_cep + '  ';
          str += cadastro.cadastro_municipio_nome + ' ';
          str += cadastro.cadastro_estado_nome;
        }
      } else {
        str += cadastro.cadastro_municipio_nome + '  ';
        str += cadastro.cadastro_estado_nome + '<br>' + cadastro.cadastro_cep;
      }
    }
    return str;
  }

}
