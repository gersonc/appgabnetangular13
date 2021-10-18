import { SelectItem } from 'primeng/api';

export interface PassagemSQLInterface {
  sql: string;
}

export interface PassagemTotalInterface {
  num: number;
}

export interface PassagemBuscaCampoInterface {
  field: string;
  header: string;
}
export interface PassagemInterface {
  passagem_id?: number;
  passagem_beneficiario?: string;
  passagem_data?: string;
  passagem_hora?: string;
  passagem_trecho?: string;
  passagem_voo?: string;
  passagem_localizador?: string;
  passagem_aerolinha_id?: number;
  passagem_aerolinha_nome?: string;
  passagem_valor?: number;
  passagem_valor2?: number;
  passagem_voado_id?: number;
  passagem_voado_sn?: string;
  passagem_observacao?: string;
}

export interface PassagemFormularioInterface extends PassagemInterface {
  passagem_id?: number;
  passagem_beneficiario?: string;
  passagem_data?: string;
  passagem_hora?: string;
  passagem_trecho?: string;
  passagem_voo?: string;
  passagem_localizador?: string;
  passagem_aerolinha_id?: number;
  passagem_aerolinha_nome?: string;
  passagem_valor?: number;
  passagem_valor2?: number;
  passagem_voado_id?: number;
  passagem_voado_sn?: string;
  passagem_observacao?: string;
  agenda?: boolean | number;
}

export interface PassagemBuscaInterface {
  passagem_id?: number;
  passagem_beneficiario?: string;
  passagem_data1?: string;
  passagem_data2?: string;
  passagem_trecho?: string;
  passagem_voo?: string;
  passagem_aerolinha_id?: number;
  passagem_voado_id?: number;
  passagem_voado_sn?: string;
  numlinhas?: string;
  inicio?: string;
  sortorder?: string;
  sortcampo?: string;
  todos?: boolean | number;
  campos?: PassagemBuscaCampoInterface[];
  ids?: PassagemBuscaCampoInterface[];
}

export interface PassagemPaginacaoInterface {
  passagem: PassagemInterface[];
  total: PassagemTotalInterface;
  sql: PassagemSQLInterface;
}

export class PassagemFormulario implements PassagemFormularioInterface {
  passagem_id = null;
  passagem_beneficiario = null;
  passagem_data = null;
  passagem_hora = null;
  passagem_trecho = null;
  passagem_voo = null;
  passagem_localizador = null;
  passagem_aerolinha_id = null;
  passagem_aerolinha_nome = null;
  passagem_valor = null;
  passagem_valor2 = null;
  passagem_voado_id = null;
  passagem_voado_sn = null;
  passagem_observacao = null;
  agenda = null;
}

export class PassagemBusca implements PassagemBuscaInterface {
  passagem_id = null;
  passagem_beneficiario = null;
  passagem_data1 = null;
  passagem_data2 = null;
  passagem_trecho = null;
  passagem_voo = null;
  passagem_aerolinha_id = null;
  passagem_voado_id = null;
  passagem_voado_sn = null;
  numlinhas = '0';
  inicio = '0';
  sortorder = '0';
  sortcampo = 'passagem_data';
  todos = false;
  campos = [];
  ids = [];
}

export interface PassagemDetalheInterface {
  passagem: PassagemInterface;
  passagem_titulo: any[];
}

export class PassagemDropdown {
  ddPassagem_voado_id: SelectItem[] = [
    {label: 'SIM', value: 1},
    {label: 'NÃO', value: 0},
  ];
}

export class PassagemArray {
  public static getArrayTitulo() {
    const passagemArrayTitulos: any[] = [];
    passagemArrayTitulos['passagem_beneficiario'] = 'BENEFICIÁRIO';
    passagemArrayTitulos['passagem_valor'] = 'VALOR';
    passagemArrayTitulos['passagem_valor2'] = 'VALOR';
    passagemArrayTitulos['passagem_data'] = 'DATA';
    passagemArrayTitulos['passagem_hora'] = 'HORA';
    passagemArrayTitulos['passagem_id'] = 'ID';
    passagemArrayTitulos['passagem_trecho'] = 'TRECHO';
    passagemArrayTitulos['passagem_voo'] = 'NUM. VOO';
    passagemArrayTitulos['passagem_localizador'] = 'LOCALIZADOR';
    passagemArrayTitulos['passagem_voado_id'] = 'VOADO S/N';
    passagemArrayTitulos['passagem_voado_sn'] = 'VOADO S/N';
    passagemArrayTitulos['passagem_aerolinha_id'] = 'COMPANHIA';
    passagemArrayTitulos['passagem_aerolinha_nome'] = 'COMPANHIA';
    passagemArrayTitulos['passagem_observacao'] = 'OBSERVAÇÃO';
    return passagemArrayTitulos;
  }
}
