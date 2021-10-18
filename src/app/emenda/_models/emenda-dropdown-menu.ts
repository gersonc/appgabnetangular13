import { SelectItem } from 'primeng/api';

export interface EmendaDropdownMenuInterface {
  dd_emenda_situacao: SelectItem[];
  dd_emenda_tipo: SelectItem[];
  dd_emenda_cadastro_tipo: SelectItem[];
  dd_emenda_ogu: SelectItem[];
  dd_emenda_funcional_programatica: SelectItem[];
  dd_emenda_cadastro: SelectItem[];
  dd_emenda_autor: SelectItem[];
  dd_cadastro_cpfcnpj: SelectItem[];
  dd_emenda_orgao_solicitado: SelectItem[];
  dd_emenda_numero: SelectItem[];
  dd_emenda_assunto: SelectItem[];
  dd_emenda_crnr: SelectItem[];
  dd_emenda_local: SelectItem[];
  dd_emenda_gmdna: SelectItem[];
  dd_emenda_numero_protocolo: SelectItem[];
  dd_emenda_uggestao: SelectItem[];
  dd_emenda_numero_empenho: SelectItem[];
  dd_emenda_data_solicitacao: SelectItem[];
  dd_emenda_data_empenho: SelectItem[];
  dd_emenda_data_pagamento: SelectItem[];
  dd_emenda_processo: SelectItem[];
  dd_emenda_numero_ordem_bancaria: SelectItem[];
  dd_emenda_regiao: SelectItem[];
  dd_emenda_cadastro_municipio: SelectItem[];
  dd_emenda_codigo: SelectItem[];
  dd_emenda_contrato: SelectItem[];
}

export class EmendaDropdownMenu implements EmendaDropdownMenuInterface {
  dd_emenda_situacao = null;
  dd_emenda_tipo = null;
  dd_emenda_cadastro_tipo = null;
  dd_emenda_ogu = null;
  dd_emenda_funcional_programatica = null;
  dd_emenda_cadastro = null;
  dd_emenda_autor = null;
  dd_cadastro_cpfcnpj = null;
  dd_emenda_orgao_solicitado = null;
  dd_emenda_numero = null;
  dd_emenda_assunto = null;
  dd_emenda_crnr = null;
  dd_emenda_local = null;
  dd_emenda_gmdna = null;
  dd_emenda_numero_protocolo = null;
  dd_emenda_uggestao = null;
  dd_emenda_numero_empenho = null;
  dd_emenda_data_solicitacao = null;
  dd_emenda_data_empenho = null;
  dd_emenda_data_pagamento = null;
  dd_emenda_processo = null;
  dd_emenda_numero_ordem_bancaria = null;
  dd_emenda_regiao = null;
  dd_emenda_cadastro_municipio = null;
  dd_emenda_codigo = null;
  dd_emenda_contrato = null;
}
