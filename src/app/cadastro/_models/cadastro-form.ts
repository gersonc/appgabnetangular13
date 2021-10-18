import { CadastroFormInterface } from './cadastro-form.interface';
import { SelectItem } from 'primeng/api';

export class CadastroForm implements CadastroFormInterface {
  cadastro = null;
  ddTipoCadastroId = null;
  ddTratamento = null;
  ddGrupo = null;
  ddMunicipioId = null;
  ddEstadoId = null;
  ddRegiaoId = null;
  ddEscolaridadeId = null;
  ddEstadoCivilId = null;
  ddSexo = null;
  ddCampo4Id = null;
}
