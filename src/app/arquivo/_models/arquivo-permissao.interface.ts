export interface ArquivoPermissaoInterface {
  arquivo_ativo: boolean;
  arquivo_cota: number;
  cota_utilizada: number;
  cota_disponivel: number;
  hash?: string;
  datah?: string;
}
