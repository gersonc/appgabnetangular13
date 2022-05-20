import { SelectItem, SelectItemGroup } from 'primeng/api';

export interface CadastroMenuDropdownInterface {
  ddCadastroTipoId?: SelectItemGroup[];
  ddCadastroMunicipioId?: SelectItem[];
  ddCadastroEstadoId?: SelectItem[];
  ddCadastroRegiaoId?: SelectItem[];
  ddCadastroGrupoId?: SelectItem[];
  ddCadastroAniversario?: SelectItem[];
  ddCadastroAnidia?: SelectItem[];
  ddCadastroQuinzena?: SelectItem[];
  ddCadastroUsuario?: SelectItem[];
  ddCadastroEstadoCivilId?: SelectItem[];
  ddCadastroSexo?: SelectItem[];
  ddCadastroZona?: SelectItem[];
  ddCadastroEscolaridadeId?: SelectItem[];
  ddCadastroCampo4Id?: SelectItem[];
  ddCadastroSn?: SelectItem[];
  ddCadastroBairro?: SelectItem[];
}
