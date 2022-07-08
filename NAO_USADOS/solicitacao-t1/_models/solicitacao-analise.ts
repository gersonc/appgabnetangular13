import { SolicitacaoAnaliseInterface, SolicitacaoCadastroAnalise } from './solicitacao-analise.interface';
import { SolicitacaoCadastroInterface } from './solicitacao-detalhe.interface';

export class SolicitacaoAnalise implements SolicitacaoCadastroAnalise {

  constructor(
    public solicitacao: SolicitacaoAnaliseInterface,
    public cadastro: SolicitacaoCadastroInterface
    ) {
    this.solicitacao.solicitacao_id = null;
    this.solicitacao.solicitacao_cadastro_tipo_nome = null;
    this.solicitacao.solicitacao_cadastro_id = null;
    this.solicitacao.solicitacao_cadastro_nome = null;
    this.solicitacao.solicitacao_data = null;
    this.solicitacao.solicitacao_assunto_nome = null;
    this.solicitacao.solicitacao_indicacao_sn = null;
    this.solicitacao.solicitacao_orgao = null;
    this.solicitacao.solicitacao_indicacao_nome = null;
    this.solicitacao.solicitacao_atendente_cadastro_nome = null;
    this.solicitacao.solicitacao_data_atendimento = null;
    this.solicitacao.solicitacao_cadastrante_cadastro_nome = null;
    this.solicitacao.solicitacao_local_nome = null;
    this.solicitacao.solicitacao_tipo_recebimento_nome = null;
    this.solicitacao.solicitacao_area_interesse_nome = null;
    this.solicitacao.solicitacao_descricao = null;
    this.solicitacao.solicitacao_reponsavel_analize_nome = null;
    this.solicitacao.solicitacao_aceita_recusada = null;
    this.solicitacao.solicitacao_posicao = null;
    this.solicitacao.solicitacao_carta = null;
    this.cadastro.cadastro_id = null;
    this.cadastro.cadastro_tipo_nome = null;
    this.cadastro.cadastro_nome = null;
    this.cadastro.cadastro_endereco = null;
    this.cadastro.cadastro_endereco_numero = null;
    this.cadastro.cadastro_endereco_complemento = null;
    this.cadastro.cadastro_bairro = null;
    this.cadastro.cadastro_municipio_nome = null;
    this.cadastro.cadastro_regiao_nome = null;
    this.cadastro.cadastro_cep = null;
    this.cadastro.cadastro_estado_nome = null;
    this.cadastro.cadastro_telefone = null;
    this.cadastro.cadastro_telefone2 = null;
    this.cadastro.cadastro_celular = null;
    this.cadastro.cadastro_celular2 = null;
    this.cadastro.cadastro_telcom = null;
    this.cadastro.cadastro_fax = null;
    this.cadastro.cadastro_email = null;
    this.cadastro.cadastro_email2 = null;
    this.cadastro.cadastro_rede_social = null;
    this.cadastro.cadastro_outras_midias = null;
    this.cadastro.cadastro_responsavel = null;
    this.cadastro.cadastro_grupo_nome = null;
    this.cadastro.cadastro_tratamento_nome = null;
    this.cadastro.cadastro_cpfcnpj = null;
    this.cadastro.cadastro_cargo = null;
  }
}
