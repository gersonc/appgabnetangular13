import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { CadastroBuscaService, CadastroService } from '../_services';
import { CadastroPaginacaoInterface, CadastroSmsPaginacaoInterface } from '../_models';
import { DropdownService } from '../../_services';
import { DropdownnomeidClass, DropdownsonomearrayClass } from '../../_models';
import { CadastroMenuDropdown } from '../_models';
import { SelectItemGroup } from 'primeng/api';
import { CarregadorService } from '../../_services';

@Injectable({
  providedIn: 'root'
})
export class CadastroListarResolver implements Resolve<CadastroPaginacaoInterface | CadastroSmsPaginacaoInterface | boolean> {
  private ddNomeIdArray = new DropdownnomeidClass();
  private ddSoNomeArray = new DropdownsonomearrayClass();
  private ddCadastro = new CadastroMenuDropdown();
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;
  private sms = true;

  constructor(
    private cadastroService: CadastroService,
    private cbs: CadastroBuscaService,
    private dd: DropdownService,
    private router: Router,
    private cs: CarregadorService
  ) { }


  populaDropdown() {

    if (!sessionStorage.getItem('cadastro-dropdown')) {

      let contador = 0;

      // ****** aniversario ******
      this.ddCadastro.ddAniversario = [
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

      // ***** anidia ******
      this.ddCadastro.ddAnidia = [
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

      // ***** quinzena *****
      this.ddCadastro.ddQuinzena = [
        { label: '1' + decodeURI('\xAA'), value: '15' },
        { label: '2' + decodeURI('\xAA'), value: '31' }
      ];

      // ***** cadastro_sexo *****
      this.ddCadastro.ddSexo = [
        { label: 'MASCULINO', value: 'M' },
        { label: 'FEMININO', value: 'F' },
        { label: 'OUTROS', value: 'O' },
        { label: 'PJ', value: 'P' }
      ];

      // ****** campos SN *********
      this.ddCadastro.ddSn = [
        { label: 'TODOS', value: '0' },
        { label: 'SIM', value: '1' },
        { label: 'NÃO', value: '2' }
      ];

      // ****** cadastro_municipio *****
      this.ddNomeIdArray.add('cadastro_municipio', 'cadastro', 'cadastro_municipio_id', 'cadastro_municipio_nome');
      // ****** cadastro_estado *****
      this.ddNomeIdArray.add('cadastro_estado', 'cadastro', 'cadastro_estado_id', 'cadastro_estado_nome');
      // ****** cadastro_regiao_nome *****
      this.ddNomeIdArray.add('cadastro_regiao_nome', 'cadastro', 'cadastro_regiao_id', 'cadastro_regiao_nome');
      // ****** cadastro_grupo_nome *****
      this.ddNomeIdArray.add('cadastro_grupo_nome', 'cadastro', 'cadastro_grupo_id', 'cadastro_grupo_nome');
      // ****** cadastro_campo4 *****
      this.ddNomeIdArray.add('cadastro_campo4', 'cadastro', 'cadastro_campo4_id', 'cadastro_campo4_nome');
      // ****** estado_civil *****
      this.ddNomeIdArray.add('cadastro_estado_civil', 'cadastro', 'cadastro_estado_civil_id', 'cadastro_estado_civil_nome');
      // ****** escolaridade *****
      this.ddNomeIdArray.add('cadastro_escolaridade', 'cadastro', 'cadastro_escolaridade_id', 'cadastro_escolaridade_nome');

      this.sub.push(this.dd.postDropdownNomeIdArray(this.ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddCadastro.ddMunicipioId = dados['cadastro_municipio'];
            this.ddCadastro.ddEstadoId = dados['cadastro_estado'];
            this.ddCadastro.ddRegiaoId = dados['cadastro_regiao_nome'];
            this.ddCadastro.ddGrupoId = dados['cadastro_grupo_nome'];
            this.ddCadastro.ddCampo4Id = dados['cadastro_campo4'];
            this.ddCadastro.ddEstadoCivilId = dados['cadastro_estado_civil'];
            this.ddCadastro.ddEscolaridadeId = dados['cadastro_escolaridade'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 4) {
              this.gravaDropDown();
            }
          }
        }));

      // ****** cadastro_tipo *****
      const a = [1, 2];
      let tipo: SelectItemGroup;
      this.ddCadastro.ddTipoCadastroId = [];
      for (const b of a) {
        this.sub.push(this.dd.getDropdown3campos(
          'cadastro',
          'cadastro_tipo',
          'cadastro_tipo_nome',
          'cadastro_tipo_tipo',
          String(b)
        ).pipe(take(1))
          .subscribe({
            next: (dados) => {
              tipo = {
                label: dados['label'].toString(),
                value: null,
                items: dados['items']
              };
              this.ddCadastro.ddTipoCadastroId.push(tipo);
            },
            error: (err) => {
              console.error(err);
            },
            complete: () => {
              contador++;
              if (contador === 4) {
                this.gravaDropDown();
              }
            }
          }));
      }

      // ****** cadastro_usuario *****
      this.ddSoNomeArray.add('cadastro_usuario', 'cadastro', 'cadastro_usuario');
      // ****** cadastro_zona *****
      this.ddSoNomeArray.add('cadastro_zona', 'cadastro', 'cadastro_zona');
      this.sub.push(this.dd.postDropdownSoNomeArray(this.ddSoNomeArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddCadastro.ddUsuario = dados['cadastro_usuario'];
            this.ddCadastro.ddZona = dados['cadastro_zona'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 4) {
              this.gravaDropDown();
            }
          }
        }));
    } else {
      this.gravaDropDown();
    }
  }

  gravaDropDown() {
    if (!sessionStorage.getItem('cadastro-dropdown')) {
      sessionStorage.setItem('cadastro-dropdown', JSON.stringify(this.ddCadastro));
    }
    this.cs.escondeCarregador();
    this.resp.next(true);
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<CadastroPaginacaoInterface> |
    Observable<CadastroSmsPaginacaoInterface> |
    Observable<boolean> |
    Observable<never> {
    this.cadastroService.getCampoCadastro();
    if (!sessionStorage.getItem('cadastro-dropdown')) {
      this.dropdown = true;
      this.sms = false;
      this.cs.mostraCarregador();
      this.populaDropdown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          if (vf) {
            this.onDestroy();
            this.cs.escondeCarregador();
            return of(vf);
          } else {
            this.onDestroy();
            this.cs.escondeCarregador();
            return EMPTY;
          }
        })
      );
    } else {
      if (sessionStorage.getItem('cadastro-busca') && this.cbs.buscaStateSN) {
        this.sms = false;
        this.cs.mostraCarregador();
        this.cbs.buscaState = JSON.parse(sessionStorage.getItem('cadastro-busca'));
        if (this.cbs.smsSN) {
          return this.cadastroService.postCadastroSmsBusca(JSON.parse(sessionStorage.getItem('cadastro-busca-sms')))
            .pipe(
              take(1),
              mergeMap(dados => {
                this.cs.escondeCarregador();
                if (dados) {
                  return of(dados);
                } else {
                  return EMPTY;
                }
              })
            );
        } else {
          return this.cadastroService.postCadastroBusca(JSON.parse(sessionStorage.getItem('cadastro-busca')))
            .pipe(
              take(1),
              mergeMap(dados => {
                this.cs.escondeCarregador();
                if (dados) {
                  return of(dados);
                } else {
                  return EMPTY;
                }
              })
            );
        }
      } else {
        this.cs.escondeCarregador();
        if (this.cbs.smsSN && this.sms === true) {
          this.router.navigate(['/cadastro/listar/sms']);
          return EMPTY;
        } else {
          this.router.navigate(['/cadastro/listar']);
          return EMPTY;
        }
      }
    }
  }

}
