import { CadastroSQLInterface } from './cadastro-SQL.interface';
import { CadastroSmsInterface } from './cadastro-sms.interface';
import { CadastroTotalInterface } from './cadastro-total.interface';

export interface CadastroSmsPaginacaoInterface {
  cadastros: CadastroSmsInterface[];
  total: CadastroTotalInterface;
  sql: CadastroSQLInterface[];
}
