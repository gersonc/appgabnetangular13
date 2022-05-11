export class DropdownsonomearrayClass {
  public dropdown: any[] = [];

  public add(nome: string, tabela: string, campo_nome: string, params?: any) {
    if (!params) {
      params = null;
    }
    const busca  = {nome, tabela, campo_nome, params};
    this.dropdown.push(busca);
  }

  public get() {
    return this.dropdown;
  }
}

export class DropdownSoDataArrayClass {
  public dropdown: any[] = [];

  public add(nome: string, tabela: string, campo_nome: string, params?: any) {
    if (!params) {
      params = null;
    }
    const busca  = {nome, tabela, campo_nome, params};
    this.dropdown.push(busca);
  }

  public get() {
    return this.dropdown;
  }
}
