export interface SmsDbInterface {
  id?: number;
  telefone: string;
  nome: string;
  municipio: string;
  resposta?: string;
  situacao?: boolean;
}
