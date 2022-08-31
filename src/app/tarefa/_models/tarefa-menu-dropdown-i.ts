import {SelectItem} from "primeng/api";

export interface TarefaMenuDropdownI {
  ddTarefa_situacao_id?: SelectItem[];
  ddTarefa_autor_id?: SelectItem[];
  ddTarefa_demandados_id?: SelectItem[];
}

export const ddTipo_listagem_id: SelectItem[] = [
  {label: 'Todas', value: 2},
  {label: 'Enviadas', value: 1},
  {label: 'Recebidas', value: 0},
];
