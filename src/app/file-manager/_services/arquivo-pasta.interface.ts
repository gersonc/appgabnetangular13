export interface PastaDadosInterface {
  arquivo_id: number;
  arquivo_nome_original: string;
  arquivo_tamanho: number;
  arquivo_tipo: string;
}

export interface ArquivoPastaInterface {
  arquivo_pasta_id: number;
  arquivo_pasta_nome: string;
  arquivos?: PastaDadosInterface[];
}
