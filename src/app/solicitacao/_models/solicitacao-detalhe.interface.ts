import {
  SolicitacaoHistoricoInterface,
  SolicitacaoInterface,
  SolicitacaoListar12Interface,
  SolicitacaoListar345Interface
} from './solicitacao.interface';
import {HistoricoProcessoI} from "../../historico-processo/_models/historico-processo";

export interface SolicitacaoCadastroInterface {
  cadastro_id?: number;
  cadastro_tipo_nome?: string;
  cadastro_nome?: string;
  cadastro_endereco?: string;
  cadastro_endereco_numero?: string;
  cadastro_endereco_complemento?: string;
  cadastro_bairro?: string;
  cadastro_municipio_nome?: string;
  cadastro_regiao_nome?: string;
  cadastro_cep?: string;
  cadastro_estado_nome?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_rede_social?: string;
  cadastro_outras_midias?: string;
  cadastro_responsavel?: string;
  cadastro_grupo_nome?: string;
  cadastro_tratamento_nome?: string;
  cadastro_cpfcnpj?: string;
  cadastro_cargo?: string;
}

export interface SolicitacaoProcessoInterface {
  processo_id: number;
  processo_numero: string;
  processo_status: string;
}

export interface SolicitacaoOficioNumInterface {
  num: number;
}

export interface SolicitacaoProcessoNumInterface {
  num: number;
}

export interface SolicitacaoOficioInterface {
  oficio_id: string;
  oficio_codigo: string;
  oficio_numero: string;
  oficio_convenio: string;
  oficio_assunto_nome: string;
  oficio_data_emissao: string;
  oficio_orgao_solicitado_nome: string;
  oficio_protocolo_numero: string;
  oficio_orgao_protocolante_nome: string;
  oficio_tipo_andamento_nome: string;
  oficio_status: string;
}

export interface SolicitacaoDetalheInterface {
  // solicitacao: SolicitacaoInterface;
  solicitacao: SolicitacaoListar12Interface | SolicitacaoListar345Interface;
  solicitacao_titulo?: any[];
  solicitacao_historico?: SolicitacaoHistoricoInterface[];
  solicitacao_historico_titulo?: any[];
  cadastro: SolicitacaoCadastroInterface;
  cadastro_titulo?: any[];
  processo_num?: SolicitacaoProcessoNumInterface[];
  processo?: SolicitacaoProcessoInterface[];
  processo_titulo?: any[];
  oficio_num?: SolicitacaoOficioNumInterface[];
  oficio?: SolicitacaoOficioInterface[];
  oficio_titulo?: any[];
  erro?: any[];
}

export interface SolicitacaoExcluirInterface {
  solicitacao: SolicitacaoInterface;
  cadastro: SolicitacaoCadastroInterface;
  processo_num?: SolicitacaoProcessoNumInterface;
  processo?: SolicitacaoProcessoInterface;
  oficio_num?: SolicitacaoOficioNumInterface;
  oficio?: SolicitacaoOficioInterface[];
  arquivo_num?: number;
  erro?: any[];
}
