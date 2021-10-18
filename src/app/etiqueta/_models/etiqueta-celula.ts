import { CadastroEtiquetaInterface } from '../../cadastro/_models';

export class EtiquetaCelula {

  public static montaCelula (cadastro: CadastroEtiquetaInterface) {
    let str = '';
    // ************ Pessoa Fisica
    if (cadastro.cadastro_tipo_tipo === 1) {
      if (cadastro.cadastro_tratamento_nome.length > 0) {
        str += cadastro.cadastro_tratamento_nome + '<br>';
      }
      if (cadastro.cadastro_nome.length > 0) {
        str += cadastro.cadastro_nome + '<br>';
      }
      if (cadastro.cadastro_cargo.length > 0) {
        // str += cadastro.cadastro_cargo + '<br>';
      }
      if (
        cadastro.cadastro_endereco.length > 0 &&
        cadastro.cadastro_endereco_numero.length > 0 &&
        cadastro.cadastro_endereco_complemento.length > 0) {
        str += cadastro.cadastro_endereco + ',';
        str += cadastro.cadastro_endereco_numero + ' ';
        str += cadastro.cadastro_endereco_complemento + '<br>';
      }
      if (
        cadastro.cadastro_endereco.length > 0 &&
        cadastro.cadastro_endereco_numero.length > 0 &&
        cadastro.cadastro_endereco_complemento.length === 0) {
        str += cadastro.cadastro_endereco + ',';
        str += cadastro.cadastro_endereco_numero + '<br>';
      }
      if (
        cadastro.cadastro_endereco.length > 0 &&
        cadastro.cadastro_endereco_numero.length === 0 &&
        cadastro.cadastro_endereco_complemento.length > 0) {
        str += cadastro.cadastro_endereco + ' ';
        str += cadastro.cadastro_endereco_complemento + '<br>';
      }
      if (
        cadastro.cadastro_endereco.length > 0 &&
        cadastro.cadastro_endereco_numero.length === 0 &&
        cadastro.cadastro_endereco_complemento.length === 0) {
        str += cadastro.cadastro_endereco + '<br>';
      }
      if (cadastro.cadastro_bairro.length > 0) {
        const nc = cadastro.cadastro_bairro.length + cadastro.cadastro_municipio_nome.length + 2;
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

      if (cadastro.cadastro_responsavel.length > 0) {
        if (cadastro.cadastro_tratamento_nome.length > 0) {
          str += cadastro.cadastro_tratamento_nome.length + '<br>';
          str += cadastro.cadastro_responsavel + '<br>';
        }
      }
      if (cadastro.cadastro_nome.length > 0) {
        str += cadastro.cadastro_nome + '<br>';
      }
      if (cadastro.cadastro_cargo.length > 0) {
        if (cadastro.cadastro_cargo !== 'PESSOA JURÍDICA') {
          str += cadastro.cadastro_cargo + '<br>';
        }
      }
      if (
        cadastro.cadastro_endereco.length > 0 &&
        cadastro.cadastro_endereco_numero.length > 0 &&
        cadastro.cadastro_endereco_complemento.length > 0) {
        str += cadastro.cadastro_endereco + ',';
        str += cadastro.cadastro_endereco_numero + ' ';
        str += cadastro.cadastro_endereco_complemento + '<br>';
      }
      if (
        cadastro.cadastro_endereco.length > 0 &&
        cadastro.cadastro_endereco_numero.length > 0 &&
        cadastro.cadastro_endereco_complemento.length === 0) {
        str += cadastro.cadastro_endereco + ',';
        str += cadastro.cadastro_endereco_numero + '<br>';
      }
      if (
        cadastro.cadastro_endereco.length > 0 &&
        cadastro.cadastro_endereco_numero.length === 0 &&
        cadastro.cadastro_endereco_complemento.length > 0) {
        str += cadastro.cadastro_endereco + ' ';
        str += cadastro.cadastro_endereco_complemento + '<br>';
      }
      if (
        cadastro.cadastro_endereco.length > 0 &&
        cadastro.cadastro_endereco_numero.length === 0 &&
        cadastro.cadastro_endereco_complemento.length === 0) {
        str += cadastro.cadastro_endereco + '<br>';
      }
      if (cadastro.cadastro_bairro.length > 0) {
        const nc = cadastro.cadastro_bairro.length + cadastro.cadastro_municipio_nome.length + 2;
        if (nc <= 32) {
          str += cadastro.cadastro_bairro + '  ';
          str += cadastro.cadastro_municipio_nome + ' ';
          str += cadastro.cadastro_estado_nome + '<br>';
          str += cadastro.cadastro_cep;
        } else {
          str += cadastro.cadastro_bairro + '<br>';
          str += cadastro.cadastro_cep + ' ';
          str += cadastro.cadastro_municipio_nome + ' ';
          str += cadastro.cadastro_estado_nome;
        }
      } else {
        str += cadastro.cadastro_municipio_nome + '  ';
        str += cadastro.cadastro_estado_nome + '<br>';
        str += cadastro.cadastro_cep;
      }
    }
    return str;
  }
}

