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
    private router: Router
  ) { }


  /*populaDropdown() {

    if (!sessionStorage.getItem('cadastro-dropdown')) {

      let contador = 0;

      // ****** aniversario ******
      this.ddCadastro.ddCadastroAniversario = this.dd.meses;

      // ***** anidia ******
      this.ddCadastro.ddCadastroAnidia = this.dd.dias;

      // ***** quinzena *****
      this.ddCadastro.ddCadastroQuinzena = this.dd.quinzena;

      // ***** cadastro_sexo *****
      this.ddCadastro.ddCadastroSexo = this.dd.sexo;

      // ****** campos SN *********
      this.ddCadastro.ddCadastroSn = this.dd.snTodos;

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
            this.ddCadastro.ddCadastroMunicipioId = dados['cadastro_municipio'];
            this.ddCadastro.ddCadastroEstadoId = dados['cadastro_estado'];
            this.ddCadastro.ddCadastroRegiaoId = dados['cadastro_regiao_nome'];
            this.ddCadastro.ddCadastroGrupoId = dados['cadastro_grupo_nome'];
            this.ddCadastro.ddCadastroCampo4Id = dados['cadastro_campo4'];
            this.ddCadastro.ddCadastroEstadoCivilId = dados['cadastro_estado_civil'];
            this.ddCadastro.ddCadastroEscolaridadeId = dados['cadastro_escolaridade'];
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
      this.ddCadastro.ddCadastroTipoId = [];
      for (const b of a) {
        this.sub.push(this.dd.getDropdown3campos(
          'cadastro',
          'cadastro_tipo_id',
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
              this.ddCadastro.ddCadastroTipoId.push(tipo);
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
            this.ddCadastro.ddCadastroUsuario = dados['cadastro_usuario'];
            this.ddCadastro.ddCadastroZona = dados['cadastro_zona'];
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
  }*/

  populaDropdownTodos() {
    if (!sessionStorage.getItem('cadastro-dropdown')) {
      this.sub.push(this.dd.getDropdownCadastroMenuTodos()
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddCadastro = dados;
            // ****** aniversario ******
            this.ddCadastro.ddCadastroAniversario = this.dd.meses;

            // ***** anidia ******
            this.ddCadastro.ddCadastroAnidia = this.dd.dias;

            // ***** quinzena *****
            this.ddCadastro.ddCadastroQuinzena = this.dd.quinzena;

            // ***** cadastro_sexo *****
            this.ddCadastro.ddCadastroSexo = this.dd.sexo;

            // ****** campos SN *********
            this.ddCadastro.ddCadastroSn = this.dd.snTodos;
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
              this.gravaDropDown();
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
      this.populaDropdownTodos();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          if (vf) {
            this.onDestroy();
            return of(vf);
          } else {
            this.onDestroy();
            return EMPTY;
          }
        })
      );
    } else {
      if (sessionStorage.getItem('cadastro-busca') && this.cbs.buscaStateSN) {
        this.sms = false;
        this.cbs.buscaState = JSON.parse(sessionStorage.getItem('cadastro-busca'));
        if (this.cbs.smsSN) {
          return this.cadastroService.postCadastroSmsBusca(JSON.parse(sessionStorage.getItem('cadastro-busca-sms')))
            .pipe(
              take(1),
              mergeMap(dados => {
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
                if (dados) {
                  return of(dados);
                } else {
                  return EMPTY;
                }
              })
            );
        }
      } else {
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
