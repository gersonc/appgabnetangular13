import { CadastroInterface } from './cadastro.interface';
import { CadastroSQLInterface } from './cadastro-SQL.interface';
import { CadastroTotalInterface } from './cadastro-total.interface';

export interface CadastroPaginacaoInterface {
  cadastros: CadastroInterface[];
  total: CadastroTotalInterface;
  sql: CadastroSQLInterface[];
}
