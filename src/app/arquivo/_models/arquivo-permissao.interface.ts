export interface ArquivoPermissaoInterface {
  config_arquivo_ativo: boolean;
  config_arquivo_cota: number;
  config_cota_utilizada: number;
  config_cota_disponivel: number;
  hash?: string;
  datah?: string;
}
