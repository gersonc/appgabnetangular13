import {CadastroEtiquetaI} from "./cadastro-etiqueta-i";

export class EtiquetaCelula {

  public static montaCelula(cadastro?: CadastroEtiquetaI | null): string  {
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
        if (cadastro.cadastro_cargo !== 'PESSOA JURÍDICA') {
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

