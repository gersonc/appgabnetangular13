import { CadastroFormularioInterface } from './cadastro-formulario.interface';
import { SelectItem } from 'primeng/api';


export interface CadastroFormInterface {
  cadastro?: CadastroFormularioInterface;
  ddTipoCadastroId?: SelectItem[];
  ddTratamento?: SelectItem[];
  ddGrupo?: SelectItem[];
  ddMunicipioId?: SelectItem[];
  ddEstadoId?: SelectItem[];
  ddRegiaoId?: SelectItem[];
  ddEscolaridadeId?: SelectItem[];
  ddEstadoCivilId?: SelectItem[];
  ddSexo?: SelectItem[];
  ddCampo4Id?: SelectItem[];
}
