import {Injectable} from '@angular/core';
import {SelectItem, SelectItemGroup} from "primeng/api";
import {DdService} from "../../_services/dd.service";
import {Subject, Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {CadastroMenuDropdownInterface} from "../_models/cadastro-menu-dropdown.interface";
import {CadastroFormI} from "../_models/cadastro-form-i";

@Injectable({
  providedIn: 'root'
})
export class CadastroDropdownMenuService {
  dados?: any[];
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];
  inicio = true;
  dds: string[] = [];

  ddCadastroAniversario: SelectItem[] = [
    { label: 'JANEIRO', value: '01' },
    { label: 'FEVEREIRO', value: '02' },
    { label: 'MARÇO', value: '03' },
    { label: 'ABRIL', value: '04' },
    { label: 'MAIO', value: '05' },
    { label: 'JUNHO', value: '06' },
    { label: 'JULHO', value: '07' },
    { label: 'AGOSTO', value: '08' },
    { label: 'SETEMBRO', value: '09' },
    { label: 'OUTUBRO', value: '10' },
    { label: 'NOVEMBRO', value: '11' },
    { label: 'DEZEMBRO', value: '12' }
  ];
  ddCadastroAnidia: SelectItem[] = [
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '29', value: '29' },
    { label: '30', value: '30' },
    { label: '31', value: '31' }
  ];
  ddCadastroQuinzena: SelectItem[] = [
    {label: '1' + decodeURI('\xAA'), value: '15'},
    {label: '2' + decodeURI('\xAA'), value: '31'}
  ];
  ddCadastroSexo: SelectItem[] = [
    {label: 'MASCULINO', value: 'M'},
    {label: 'FEMININO', value: 'F'},
    {label: 'OUTROS', value: 'O'},
    {label: 'PJ', value: 'P'}
  ];
  ddCadastroSn: SelectItem[] = [
    {label: 'TODOS', value: '0'},
    {label: 'SIM', value: '1'},
    {label: 'NÃO', value: '2'}
  ];
  ddn: CadastroMenuDropdownInterface = {
    ddCadastroTipoId: [],
    ddCadastroMunicipioId: [],
    ddCadastroEstadoId: [],
    ddCadastroRegiaoId: [],
    ddCadastroGrupoId: [],
    ddCadastroEstadoCivilId: [],
    ddCadastroZona: [],
    ddCadastroEscolaridadeId: [],
    ddCadastroCampo4Id: [],
    ddCadastroBairro: [],
    ddCadastroAniversario: [
      { label: 'JANEIRO', value: '01' },
      { label: 'FEVEREIRO', value: '02' },
      { label: 'MARÇO', value: '03' },
      { label: 'ABRIL', value: '04' },
      { label: 'MAIO', value: '05' },
      { label: 'JUNHO', value: '06' },
      { label: 'JULHO', value: '07' },
      { label: 'AGOSTO', value: '08' },
      { label: 'SETEMBRO', value: '09' },
      { label: 'OUTUBRO', value: '10' },
      { label: 'NOVEMBRO', value: '11' },
      { label: 'DEZEMBRO', value: '12' }
    ],
    ddCadastroAnidia: [
      { label: '01', value: '01' },
      { label: '02', value: '02' },
      { label: '03', value: '03' },
      { label: '04', value: '04' },
      { label: '05', value: '05' },
      { label: '06', value: '06' },
      { label: '07', value: '07' },
      { label: '08', value: '08' },
      { label: '09', value: '09' },
      { label: '10', value: '10' },
      { label: '11', value: '11' },
      { label: '12', value: '12' },
      { label: '13', value: '13' },
      { label: '14', value: '14' },
      { label: '15', value: '15' },
      { label: '16', value: '16' },
      { label: '17', value: '17' },
      { label: '18', value: '18' },
      { label: '19', value: '19' },
      { label: '20', value: '20' },
      { label: '21', value: '21' },
      { label: '22', value: '22' },
      { label: '23', value: '23' },
      { label: '24', value: '24' },
      { label: '25', value: '25' },
      { label: '26', value: '26' },
      { label: '27', value: '27' },
      { label: '28', value: '28' },
      { label: '29', value: '29' },
      { label: '30', value: '30' },
      { label: '31', value: '31' }
    ],
    ddCadastroUsuario: [],
    ddCadastroSexo: [
      {label: 'MASCULINO', value: 'M'},
      {label: 'FEMININO', value: 'F'},
      {label: 'OUTROS', value: 'O'},
      {label: 'PJ', value: 'P'}
    ],
    ddCadastroSn: [
      {label: 'TODOS', value: '0'},
      {label: 'SIM', value: '1'},
      {label: 'NÃO', value: '2'}
    ],
    ddCadastroQuinzena: [
      {label: '1' + decodeURI('\xAA'), value: '15'},
      {label: '2' + decodeURI('\xAA'), value: '31'}
    ]
  }


  constructor(
    public dd: DdService,
  ) { }




  getDropdownMenu() {
    this.sub.push(this.dd.getDd('cadastro_menu-dropdown')
      .pipe(take(1))
      .subscribe((dados) => {
          this.dados = dados;
          this.dados['ddCadastroAniversario'] = this.ddn.ddCadastroAniversario;
          this.dados['ddCadastroAnidia'] = this.ddn.ddCadastroAnidia;
          this.dados['ddCadastroSn'] = this.ddn.ddCadastroSn;
          this.dados['ddCadastroSexo'] = this.ddn.ddCadastroSexo;
          this.dados['ddCadastroQuinzena'] = this.ddn.ddCadastroQuinzena;
        },
        (err) => console.error(err),
        () => {
          this.gravaDropDown();
        }
      )
    );
  }

  gravaDropDown(cadastro?: CadastroFormI) {
    if (cadastro !== undefined) {
      this.verificaAtualizacao(cadastro);
    } else {
      if (!sessionStorage.getItem('cadastro_menu-dropdown')) {
        if (!this.inicio) {

          sessionStorage.setItem('cadastro_menu-dropdown', JSON.stringify(this.dados));
          this.sub.forEach(s => {
            s.unsubscribe()
          });
          this.dados = undefined;
          this.lerDropDownSession();
          this.resp.next(true);
          this.resp.complete();
        }
        if (this.inicio) {
          this.inicio = false;
          this.getDropdownMenu();
        }
      } else {
        if (this.ddn.ddCadastroTipoId === undefined || this.ddn.ddCadastroTipoId.length === 0) {
          this.lerDropDownSession();
        }
        this.resp.next(false);
        this.resp.complete();
      }
    }
  }

  gravaDropDownSession() {
    sessionStorage.setItem('cadastro_menu-dropdown', JSON.stringify(this.ddn));
  }

  lerDropDownSession() {
    if (sessionStorage.getItem('cadastro_menu-dropdown')) {
      const d: CadastroMenuDropdownInterface = JSON.parse(sessionStorage.getItem('cadastro_menu-dropdown'));
      this.ddn.ddCadastroTipoId = d.ddCadastroTipoId;
      this.ddn.ddCadastroMunicipioId = d.ddCadastroMunicipioId;
      this.ddn.ddCadastroEstadoId = d.ddCadastroEstadoId;
      this.ddn.ddCadastroRegiaoId = d.ddCadastroRegiaoId;
      this.ddn.ddCadastroGrupoId = d.ddCadastroGrupoId;
      // this.ddn.ddCadastroAniversario = d.ddCadastroAniversario;
      // this.ddn.ddCadastroAnidia = d.ddCadastroAnidia;
      this.ddn.ddCadastroUsuario = d.ddCadastroUsuario;
      this.ddn.ddCadastroEstadoCivilId = d.ddCadastroEstadoCivilId;
      this.ddn.ddCadastroZona = d.ddCadastroZona;
      this.ddn.ddCadastroEscolaridadeId = d.ddCadastroEscolaridadeId;
      this.ddn.ddCadastroCampo4Id = d.ddCadastroCampo4Id;
      this.ddn.ddCadastroBairro = d.ddCadastroBairro;
    }
  }



  resetTodos() {
    this.inicio = true;
    this.ddn.ddCadastroTipoId = [];
    this.ddn.ddCadastroMunicipioId = [];
    this.ddn.ddCadastroEstadoId = [];
    this.ddn.ddCadastroRegiaoId = [];
    this.ddn.ddCadastroGrupoId = [];
    // this.ddn.ddCadastroAniversario = [];
    // this.ddn.ddCadastroAnidia = [];
    this.ddn.ddCadastroUsuario = [];
    this.ddn.ddCadastroEstadoCivilId = [];
    this.ddn.ddCadastroZona = [];
    this.ddn.ddCadastroEscolaridadeId = [];
    this.ddn.ddCadastroCampo4Id = [];
    this.ddn.ddCadastroBairro = [];
  }

  verificaCampo(campo: string, valor: any) {
    let dds: string | null = null;
    switch (campo) {
      case 'cadastro_municipio_id': {
        if (this.ddn.ddCadastroMunicipioId.findIndex(d => d.value === +valor) === -1) {
          dds = 'ddCadastroMunicipioId';
        }
        break;
      }
      case 'cadastro_estado_id': {
        if (this.ddn.ddCadastroEstadoId.findIndex(d => d.value === +valor) === -1) {
          dds = 'ddCadastroEstadoId';
        }
        break;
      }
      case 'cadastro_regiao_id': {
        if (this.ddn.ddCadastroRegiaoId.findIndex(d => d.value === +valor) === -1) {
          dds = 'ddCadastroRegiaoId';
        }
        break;
      }
      case 'cadastro_grupo_id': {
        if (this.ddn.ddCadastroGrupoId.findIndex(d => d.value === +valor) === -1) {
          dds = 'ddCadastroGrupoId';
        }
        break;
      }
      case 'cadastro_escolaridade_id': {
        if (this.ddn.ddCadastroEscolaridadeId.findIndex(d => d.value === +valor) === -1) {
          dds = 'ddCadastroEscolaridadeId';
        }
        break;
      }
      case 'cadastro_campo4_id': {
        if (this.ddn.ddCadastroCampo4Id.findIndex(d => d.value === +valor) === -1) {
          dds = 'ddCadastroCampo4Id';
        }
        break;
      }
    }


    if (dds !== null) {
      this.sub.push(this.dd.getDd([dds])
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.dds.forEach(nome => {
              this.ddn[nome] = dados[nome];
            });
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            this.dds = [];
            sessionStorage.setItem('cadastro_menu-dropdown', JSON.stringify(this.ddn));
            this.gravaDropDown();
          }
        })
      );
      return true;
    } else {
      this.gravaDropDown();
      return false
    }
  }


  verificaAtualizacao(cadastro: CadastroFormI) {
    if (this.ddn.ddCadastroMunicipioId.findIndex(d => d.value === cadastro.cadastro_municipio_id) === -1) {
      this.dds.push('ddCadastroMunicipioId');
    }
    if (this.ddn.ddCadastroEstadoId.findIndex(d => d.value === cadastro.cadastro_estado_id) === -1) {
      this.dds.push('ddCadastroEstadoId');
    }
    if (this.ddn.ddCadastroRegiaoId.findIndex(d => d.value === cadastro.cadastro_regiao_id) === -1) {
      this.dds.push('ddCadastroRegiaoId');
    }
    if (this.ddn.ddCadastroGrupoId.findIndex(d => d.value === cadastro.cadastro_grupo_id) === -1) {
      this.dds.push('ddCadastroGrupoId');
    }
    /*if (this.ddn.ddCadastroAniversario.findIndex(d => d.value === cadastro.cadastro_data_nascimento) === -1) {
      this.dds.push('ddCadastroAniversario');
    }*/
    /*if (this.ddn.ddCadastroAnidia.findIndex(d => d.value === cadastro.cadastro_data_nascimento) === -1) {
      this.dds.push('ddCadastroAnidia');
    }*/
    if (this.ddn.ddCadastroZona.findIndex(d => d.value === cadastro.cadastro_zona) === -1) {
      this.dds.push('ddCadastroZona');
    }
    if (this.ddn.ddCadastroBairro.findIndex(d => d.value === cadastro.cadastro_bairro) === -1) {
      this.dds.push('ddCadastroBairro');
    }
    if (this.ddn.ddCadastroEscolaridadeId.findIndex(d => d.value === cadastro.cadastro_escolaridade_id) === -1) {
      this.dds.push('ddCadastroEscolaridadeId');
    }
    if (this.ddn.ddCadastroCampo4Id.findIndex(d => d.value === cadastro.cadastro_campo4_id) === -1) {
      this.dds.push('ddCadastroCampo4Id');
    }

    if (this.dds.length > 0) {
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.dds.forEach(nome => {
              this.ddn[nome] = dados[nome];
            });
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            // this.dds = [];
            sessionStorage.setItem('cadastro_menu-dropdown', JSON.stringify(this.ddn));
            this.gravaDropDown();
          }
        })
      );
      return true;
    } else {
      return false
    }

  }
}
