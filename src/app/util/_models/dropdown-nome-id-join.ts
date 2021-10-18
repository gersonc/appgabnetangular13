export class DropdownNomeIdJoin {
  private dropdown: any[] = [];

  public add (nome: string, tabela1: string, campo_id1: string, campo_id2: string, campo_nome: string, tabela2: string, campo_id3: string, join?: string|undefined|null, parametros?: string|undefined|null ) {
    if (!join) {
      join = null;
    }
    if (!parametros) {
      parametros = null;
    }
    const busca  = {nome, tabela1, campo_id1, campo_id2, campo_nome, tabela2, campo_id3, join, parametros};
    this.dropdown.push(busca);
  }

  public get() {
    return this.dropdown;
  }
}
