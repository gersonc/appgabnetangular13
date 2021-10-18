import { CadastroSmsPaginacaoInterface } from './cadastro-sms-paginacao.interface';

export class CadastroSmsPaginacao implements CadastroSmsPaginacaoInterface {
  cadastros = null;
  total = null;
  sql = null;
}
