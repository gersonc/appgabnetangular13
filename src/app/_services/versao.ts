export class Versao {
  // FEDERAL COMPLETO
  public static versao1 = {
    varsao_id: 1,
    solicitacao: {
      ativo: true,
      solicitacao_tipo_recebimento_nome: {
        ativo: true,
        titulo: 'TP. RECEBIMENTO'
      },
      solicitacao_local_nome: {
        ativo: true,
        titulo: 'NÚCLEO'
      },
      solicitacao_orgao: {
        ativo: false,
        titulo: 'ORGÃO SOLICITADO'
      },
      processo_numero: {
        ativo: true,
        titulo: 'PROCESSO'
      },
      processo_status2: {
        ativo: true,
        titulo: 'SIT. PROCESSO'
      },
      cadastro_bairro: {
        ativo: false,
        titulo: 'BAIRRO'
      },
      solicitacao_reponsavel_analize_nome: {
        ativo: true,
        titulo: 'RESPONSÁVEL'
      },
      solicitacao_indicacao_sn: {
        ativo: true,
        titulo: 'INDICADO S/N'
      },
      historico_data: {
        ativo: true,
        titulo: 'PROC.HIS.DT.'
      },
      historico_andamento: {
        ativo: true,
        titulo: 'PROC. HIST. ANDAMENTO'
      },
      solicitacao_carta: {
        ativo: true,
        titulo: 'RESPOSTA'
      },
      solicitacao_aceita_recusada: {
        ativo: true,
        titulo: 'OBSERVAÇÕES'
      }
    }
  };
  // VEREADOR
  public static versao3 = {
    varsao_id: 3,
    solicitacao: {
      ativo: true,
      solicitacao_tipo_recebimento_nome: {
        ativo: true,
        titulo: 'N° OFÍCIO'
      },
      solicitacao_local_nome: {
        ativo: false,
        titulo: 'NÚCLEO'
      },
      solicitacao_orgao: {
        ativo: true,
        titulo: 'ORGÃO SOLICITADO'
      },
      processo_numero: {
        ativo: false,
        titulo: 'PROCESSO'
      },
      processo_status: {
        ativo: false,
        titulo: 'SIT. PROCESSO'
      },
      cadastro_bairro: {
        ativo: true,
        titulo: 'BAIRRO'
      },
      solicitacao_reponsavel_analize_nome: {
        ativo: false,
        titulo: 'RESPONSÁVEL'
      },
      solicitacao_indicacao_sn: {
        ativo: false,
        titulo: 'INDICADO S/N'
      },
      historico_data: {
        ativo: true,
        titulo: 'HIST. DATA'
      },
      historico_andamento: {
        ativo: true,
        titulo: 'HISTÓRICO ANDAMENTO'
      },
      solicitacao_carta: {
        ativo: false,
        titulo: 'RESPOSTA'
      },
      solicitacao_aceita_recusada: {
        ativo: true,
        titulo: 'OBSERVAÇÕES'
      }
    }
  };
  // FEDERAL SIMPLES
  public static versao4 = {
    varsao_id: 4,
    solicitacao: {
      ativo: true,
      solicitacao_tipo_recebimento_nome: {
        ativo: true,
        titulo: 'N° OFÍCIO'
      },
      solicitacao_local_nome: {
        ativo: false,
        titulo: 'NÚCLEO'
      },
      solicitacao_orgao: {
        ativo: true,
        titulo: 'ORGÃO SOLICITADO'
      },
      processo_numero: {
        ativo: false,
        titulo: 'PROCESSO'
      },
      processo_status2: {
        ativo: false,
        titulo: 'SIT. PROCESSO'
      },
      cadastro_bairro: {
        ativo: false,
        titulo: 'BAIRRO'
      },
      solicitacao_reponsavel_analize_nome: {
        ativo: false,
        titulo: 'RESPONSÁVEL'
      },
      solicitacao_indicacao_sn: {
        ativo: false,
        titulo: 'INDICADO S/N'
      },
      historico_data: {
        ativo: true,
        titulo: 'HIST. DATA'
      },
      historico_andamento: {
        ativo: true,
        titulo: 'HISTÓRICO ANDAMENTO'
      },
      solicitacao_carta: {
        ativo: false,
        titulo: 'RESPOSTA'
      },
      solicitacao_aceita_recusada: {
        ativo: true,
        titulo: 'OBSERVAÇÕES'
      }
    }
  };

  public static getVersao(n: number) {
    let rsp: any;
    switch (n) {
      case 1:
        rsp = Versao.versao1;
        break;
      case 3:
        rsp = Versao.versao3;
        break;
      case 4:
        rsp = Versao.versao4;
        break;
    }
    return rsp;
  }

}

