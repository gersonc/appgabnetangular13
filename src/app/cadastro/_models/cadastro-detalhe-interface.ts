import { ArquivoInterface, ArquivoNumInterface } from '../../arquivo/_models';
import {CadastroI} from "./cadastro-i";

export interface CadastroSolicitacaoNumInterface {
  num: number;
}

export interface CadastroSolicitacaoInterface {
  solicitacao_id: number;
  solicitacao_posicao: string;
  solicitacao_data: string;
  solicitacao_assunto_nome: string;
}

export interface CadastroProcessoNumInterface {
  num: number;
}

export interface CadastroProcessoInterface {
  processo_id: number;
  processo_numero: string;
  processo_status: string;
  solicitacao_assunto_nome: string;
}

export interface CadastroOficioOrgaoSolicitadoNumInterface {
  num: number;
}

export interface CadastroOficioOrgaoSolicitadoInterface {
  oficio_id: number;
  oficio_codigo: string;
  oficio_numero: string;
  oficio_data_emissao: string;
  oficio_status: string;
  oficio_cadastro_nome: string;
}

export interface CadastroOficioOrgaoProtocolanteNumInterface {
  num: number;
}

export interface CadastroOficioOrgaoProtocolanteInterface {
  oficio_id: number;
  oficio_codigo: string;
  oficio_numero: string;
  oficio_data_emissao: string;
  oficio_status: string;
  oficio_cadastro_nome: string;
}

export interface CadastroOficioResponsavelNumInterface {
  num: number;
}

export interface CadastroOficioResponsavelInterface {
  oficio_id: number;
  oficio_codigo: string;
  oficio_numero: string;
  oficio_data_emissao: string;
  oficio_status: string;
  oficio_orgao_solicitado_nome: string;
}

export interface CadastroVinculosInterface {
  solicitacao: CadastroSolicitacaoInterface[];
  processo: CadastroProcessoInterface[];
  oficio_orgao_solicitado: CadastroOficioOrgaoSolicitadoInterface[];
  oficio_orgao_protocolante: CadastroOficioOrgaoProtocolanteInterface[];
  oficio_cadastro_responsavel: CadastroOficioResponsavelInterface[];
  solicitacao_num: CadastroSolicitacaoNumInterface[];
  processo_num: CadastroProcessoNumInterface[];
  oficio_orgao_solicitado_num: CadastroOficioOrgaoSolicitadoNumInterface[];
  oficio_orgao_protocolante_num: CadastroOficioOrgaoProtocolanteNumInterface[];
  oficio_cadastro_responsavel_num: CadastroOficioResponsavelNumInterface[];

}

export interface CadastroDetalheCompletoInterface {
  cadastro: CadastroI;
  cadastro_titulo?: any[];
  solicitacao: CadastroSolicitacaoInterface[];
  solicitacao_titulo?: any[];
  processo: CadastroProcessoInterface[];
  processo_titulo?: any[];
  processo_historicos_numero: number;
  oficio_orgao_solicitado: CadastroOficioOrgaoSolicitadoInterface[];
  oficio_orgao_solicitado_titulo: any[];
  oficio_orgao_protocolante: CadastroOficioOrgaoProtocolanteInterface[];
  oficio_orgao_protocolante_titulo: any[];
  oficio_cadastro_responsavel: CadastroOficioResponsavelInterface[];
  oficio_cadastro_responsavel_titulo: any[];
  solicitacao_num?: CadastroSolicitacaoNumInterface[];
  processo_num?: CadastroProcessoNumInterface[];
  oficio_orgao_solicitado_num?: CadastroOficioOrgaoSolicitadoNumInterface[];
  oficio_orgao_protocolante_num?: CadastroOficioOrgaoProtocolanteNumInterface[];
  oficio_cadastro_responsavel_num?: CadastroOficioResponsavelNumInterface[];
  arquivo?: ArquivoInterface[];
  arquivo_num?: ArquivoNumInterface[];
  erro?: any[];
}
