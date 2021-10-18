import {OficioListagemInterface} from "../../oficio/_models";

export class EmendaArray {
  public static getArrayTitulo() {
    const emendaArrayTitulos: any[] = [];
    emendaArrayTitulos['emenda_id'] = 'ID';
    emendaArrayTitulos['emenda_cadastro_tipo_id'] = 'TIPO DE SOLICITANTE';
    emendaArrayTitulos['emenda_cadastro_tipo_nome'] = 'TIPO DE SOLICITANTE';
    emendaArrayTitulos['emenda_cadastro_id'] = 'SOLICITANTE';
    emendaArrayTitulos['emenda_cadastro_nome'] = 'SOLICITANTE';
    emendaArrayTitulos['emenda_autor_tipo_id'] = 'TIPO DE AUTOR';
    emendaArrayTitulos['emenda_autor_tipo_nome'] = 'TIPO DE AUTOR';
    emendaArrayTitulos['emenda_autor_id'] = 'AUTOR';
    emendaArrayTitulos['emenda_autor_nome'] = 'AUTOR';
    emendaArrayTitulos['emenda_situacao'] = 'SITUAÇÃO';
    emendaArrayTitulos['emenda_numero'] = 'NÚM EMENDA';
    emendaArrayTitulos['emenda_funcional_programatica'] = 'FUNC. PROGRAMÁTICA';
    emendaArrayTitulos['emenda_orgao_solicitado_id'] = 'ORGÃO SOLICITADO';
    emendaArrayTitulos['emenda_orgao_solicitado_nome'] = 'ORGÃO SOLICITADO';
    emendaArrayTitulos['emenda_numero_protocolo'] = 'NUM. PROTOCOLO';
    emendaArrayTitulos['emenda_assunto_id'] = 'ASSUNTO';
    emendaArrayTitulos['emenda_assunto_nome'] = 'ASSUNTO';
    emendaArrayTitulos['emenda_data_solicitacao'] = 'DT. SOLICITAÇÃO';
    emendaArrayTitulos['emenda_processo'] = 'CONTRATO/PROCESSO';
    emendaArrayTitulos['emenda_tipo_emenda_id'] = 'TIPO DE EMENDA';
    emendaArrayTitulos['emenda_tipo_emenda_nome'] = 'TIPO DE EMENDA';
    emendaArrayTitulos['emenda_ogu_id'] = 'O.G.U.';
    emendaArrayTitulos['emenda_ogu_nome'] = 'O.G.U.';
    emendaArrayTitulos['emenda_valor_solicitadado'] = 'VL. SOLICITADO';
    emendaArrayTitulos['emenda_valor_empenhado'] = 'VL. EMPENHADO';
    emendaArrayTitulos['emenda_data_empenho'] = 'DT. EMPENHO';
    emendaArrayTitulos['emenda_numero_empenho'] = 'NUM EMPENHO';
    emendaArrayTitulos['emenda_crnr'] = 'CR.NR.';
    emendaArrayTitulos['emenda_gmdna'] = 'GND/MA';
    emendaArrayTitulos['emenda_observacao_pagamento'] = 'INFO. PGTO';
    emendaArrayTitulos['emenda_data_pagamento'] = 'DT. PAGAMENTO';
    emendaArrayTitulos['emenda_valor_pago'] = 'VL PAGAMENTO';
    emendaArrayTitulos['emenda_numero_ordem_bancaria'] = 'ORD. BANCÁRIA';
    emendaArrayTitulos['emenda_justificativa'] = 'JUSTIFICATIVA';
    emendaArrayTitulos['emenda_local_id'] = 'NÚCLEO';
    emendaArrayTitulos['emenda_local_nome'] = 'NÚCLEO';
    emendaArrayTitulos['emenda_uggestao'] = 'UG/GESTÃO';
    emendaArrayTitulos['emenda_siconv'] = 'SICONV';
    emendaArrayTitulos['emenda_regiao'] = 'REGIÃO';
    emendaArrayTitulos['emenda_contrato'] = 'CONTRATO CAIXA';
    emendaArrayTitulos['emenda_porcentagem'] = '% CONCLUIDA';
    emendaArrayTitulos['cadastro_cpfcnpj'] = 'CPF/CNPJ';
    emendaArrayTitulos['cadastro_municipio_nome'] = 'MUNICÍPIO';
    emendaArrayTitulos['his_id'] = 'HT ID';
    emendaArrayTitulos['his_emenda_id'] = 'EM ID';
    emendaArrayTitulos['his_data'] = 'DATA';
    emendaArrayTitulos['his_usuario'] = 'USUÁRIO';
    emendaArrayTitulos['his_texto'] = 'HISTÓRICO';
    return emendaArrayTitulos;
  }
}

export interface HistoricoEmendaInterface {
  his_id?: number;
  his_emenda_id?: number;
  his_data?: string;
  his_usuario?: string;
  his_texto?: string;
}

export class HistoricoEmenda implements HistoricoEmendaInterface{
  his_id = null;
  his_emenda_id = null;
  his_data = null;
  his_usuario = null;
  his_texto = null;
}

export interface EmendaInterface {
  emenda_id?: number;
  emenda_cadastro_tipo_id?: number;
  emenda_cadastro_tipo_nome?: string;
  emenda_cadastro_id?: number;
  emenda_cadastro_nome?: string;
  emenda_autor_tipo_id?: number;
  emenda_autor_tipo_nome?: string;
  emenda_autor_id?: number;
  emenda_autor_nome?: string;
  emenda_situacao?: string;
  emenda_numero?: string;
  emenda_funcional_programatica?: string;
  emenda_orgao_solicitado_id?: number;
  emenda_orgao_solicitado_nome?: string;
  emenda_numero_protocolo?: string;
  emenda_assunto_id?: number;
  emenda_assunto_nome?: string;
  emenda_data_solicitacao?: string;
  emenda_processo?: string;
  emenda_tipo_emenda_id?: number;
  emenda_tipo_emenda_nome?: string;
  emenda_ogu_id?: number;
  emenda_ogu_nome?: string;
  emenda_valor_solicitadado?: string;
  emenda_valor_empenhado?: string;
  emenda_data_empenho?: string;
  emenda_numero_empenho?: string;
  emenda_crnr?: string;
  emenda_gmdna?: string;
  emenda_observacao_pagamento?: string;
  emenda_data_pagamento?: string;
  emenda_valor_pago?: string;
  emenda_numero_ordem_bancaria?: string;
  emenda_justificativa?: string;
  emenda_local_id?: number;
  emenda_local_nome?: string;
  emenda_uggestao?: string;
  emenda_siconv?: string;
  emenda_regiao?: string;
  emenda_contrato?: string;
  emenda_porcentagem?: string;
  cadastro_cpfcnpj?: string;
  cadastro_municipio_nome?: string;
}

export interface EmendaListarInterface {
  emenda_id?: number;
  emenda_cadastro_tipo_id?: number;
  emenda_cadastro_tipo_nome?: string;
  emenda_cadastro_id?: number;
  emenda_cadastro_nome?: string;
  emenda_autor_tipo_id?: number;
  emenda_autor_tipo_nome?: string;
  emenda_autor_id?: number;
  emenda_autor_nome?: string;
  emenda_situacao?: string;
  emenda_numero?: string;
  emenda_funcional_programatica?: string;
  emenda_orgao_solicitado_id?: number;
  emenda_orgao_solicitado_nome?: string;
  emenda_numero_protocolo?: string;
  emenda_assunto_id?: number;
  emenda_assunto_nome?: string;
  emenda_data_solicitacao?: string;
  emenda_processo?: string;
  emenda_tipo_emenda_id?: number;
  emenda_tipo_emenda_nome?: string;
  emenda_ogu_id?: number;
  emenda_ogu_nome?: string;
  emenda_valor_solicitadado?: string;
  emenda_valor_empenhado?: string;
  emenda_data_empenho?: string;
  emenda_numero_empenho?: string;
  emenda_crnr?: string;
  emenda_gmdna?: string;
  emenda_observacao_pagamento?: string;
  emenda_data_pagamento?: string;
  emenda_valor_pago?: string;
  emenda_numero_ordem_bancaria?: string;
  emenda_justificativa?: string;
  emenda_local_id?: number;
  emenda_local_nome?: string;
  emenda_uggestao?: string;
  emenda_siconv?: string;
  emenda_regiao?: string;
  emenda_contrato?: string;
  emenda_porcentagem?: string;
  cadastro_cpfcnpj?: string;
  cadastro_municipio_nome?: string;
  historico_emenda?: HistoricoEmendaInterface[];
  historico_emenda_num?: number;
}

export class EmendaListar implements EmendaListarInterface{
  emenda_id = null;
  emenda_cadastro_tipo_id = null;
  emenda_cadastro_tipo_nome = null;
  emenda_cadastro_id = null;
  emenda_cadastro_nome = null;
  emenda_autor_tipo_id = null;
  emenda_autor_tipo_nome = null;
  emenda_autor_id = null;
  emenda_autor_nome = null;
  emenda_situacao = null;
  emenda_numero = null;
  emenda_funcional_programatica = null;
  emenda_orgao_solicitado_id = null;
  emenda_orgao_solicitado_nome = null;
  emenda_numero_protocolo = null;
  emenda_assunto_id = null;
  emenda_assunto_nome = null;
  emenda_data_solicitacao = null;
  emenda_processo = null;
  emenda_tipo_emenda_id = null;
  emenda_tipo_emenda_nome = null;
  emenda_ogu_id = null;
  emenda_ogu_nome = null;
  emenda_valor_solicitadado = null;
  emenda_valor_empenhado = null;
  emenda_data_empenho = null;
  emenda_numero_empenho = null;
  emenda_crnr = null;
  emenda_gmdna = null;
  emenda_observacao_pagamento = null;
  emenda_data_pagamento = null;
  emenda_valor_pago = null;
  emenda_numero_ordem_bancaria = null;
  emenda_justificativa = null;
  emenda_local_id = null;
  emenda_local_nome = null;
  emenda_uggestao = null;
  emenda_siconv = null;
  emenda_regiao = null;
  emenda_contrato = null;
  emenda_porcentagem = null;
  cadastro_cpfcnpj = null;
  cadastro_municipio_nome = null;
  historico_emenda = [];
  historico_emenda_num = null;
}


export interface EmendaTotalInterface {
  num: number;
}

export interface EmendaSQLInterface {
  sql: string;
}

export interface EmendaPaginacaoInterface {
  emenda: EmendaListarInterface[];
  total: EmendaTotalInterface;
  sql: EmendaSQLInterface[];
}

export interface EmendaDetalheInterface {
  emenda: EmendaListarInterface;
  titulos: any[];
}

export interface EmendaFormularioInterface {
  emenda_id?: number;
  emenda_cadastro_tipo_id?: number;
  emenda_cadastro_id?: number;
  emenda_autor_nome?: string;
  emenda_situacao?: string;
  emenda_numero?: string;
  emenda_funcional_programatica?: string;
  emenda_orgao_solicitado_nome?: string;
  emenda_numero_protocolo?: string;
  emenda_assunto_id?: number;
  emenda_data_solicitacao?: string;
  emenda_processo?: string;
  emenda_tipo_emenda_id?: number;
  emenda_ogu_id?: number;
  emenda_valor_solicitadado?: string;
  emenda_valor_empenhado?: string;
  emenda_data_empenho?: string;
  emenda_numero_empenho?: string;
  emenda_crnr?: string;
  emenda_gmdna?: string;
  emenda_observacao_pagamento?: string;
  emenda_data_pagamento?: string;
  emenda_valor_pago?: string;
  emenda_numero_ordem_bancaria?: string;
  emenda_justificativa?: string;
  emenda_local_id?: number;
  emenda_uggestao?: string;
  emenda_siconv?: string;
  emenda_regiao?: string;
  emenda_contrato?: string;
  emenda_porcentagem?: string;
  cadastro_cpfcnpj?: string;
  cadastro_municipio_nome?: string;
  his_texto?: string;
}

export class EmendaFormulario implements EmendaFormularioInterface{
  emenda_id = null;
  emenda_cadastro_tipo_id = null;
  emenda_cadastro_id = null;
  emenda_autor_nome = null;
  emenda_situacao = null;
  emenda_numero = null;
  emenda_funcional_programatica = null;
  emenda_orgao_solicitado_nome = null;
  emenda_numero_protocolo = null;
  emenda_assunto_id = null;
  emenda_data_solicitacao = null;
  emenda_processo = null;
  emenda_tipo_emenda_id = null;
  emenda_ogu_id = null;
  emenda_valor_solicitadado = null;
  emenda_valor_empenhado = null;
  emenda_data_empenho = null;
  emenda_numero_empenho = null;
  emenda_crnr = null;
  emenda_gmdna = null;
  emenda_observacao_pagamento = null;
  emenda_data_pagamento = null;
  emenda_valor_pago = null;
  emenda_numero_ordem_bancaria = null;
  emenda_justificativa = null;
  emenda_local_id = null;
  emenda_uggestao = null;
  emenda_siconv = null;
  emenda_regiao = null;
  emenda_contrato = null;
  emenda_porcentagem = null;
  cadastro_cpfcnpj = null;
  cadastro_municipio_nome = null;
  his_texto = null;
}
