export class DropdownnomeidClass {

  private dropdown: any[] = [];

  public add(nome: string, tabela: string, campo_id: string, campo_nome: string, parametros?: string | undefined | null) {
    if (!parametros) {
      parametros = null;
    }
    const busca  = {nome, tabela, campo_id, campo_nome, parametros};
    this.dropdown.push(busca);
  }

  public get() {
    return this.dropdown;
  }

  public count() {
    return this.dropdown.length;
  }
}
