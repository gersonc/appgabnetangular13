import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { DropdownnomeidClass, DropdownsonomearrayClass } from '../../_models';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class EmendaCadastroFormResolver implements Resolve<number[]> {
  private ddNomeIdArray = new DropdownnomeidClass();
  private ddSoNomeArray = new DropdownsonomearrayClass();
  private sub: Subscription[] = [];
  private resp = new Subject<number[]>();
  private resp$ = this.resp.asObservable();
  private resposta = [0, 1, 2, 3];


  constructor(
    private router: Router,
    private dd: DropdownService,
  ) { }

  populaDados() {

    if (!sessionStorage.getItem('dropdown-sexo')) {
      const ddSexo = [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
        { label: 'Não Aplicavel', value: 'S' }
      ];
      sessionStorage.setItem('dropdown-sexo', JSON.stringify(ddSexo));
    }

    let contador = 2;

    // ***     Tipo Cadastro      *************************
    if (!sessionStorage.getItem('dropdown-tipo_cadastro')) {

      let ddTipoCadastroId: SelectItem[];

      const d = {
        tabela: 'tipo_cadastro',
        campo_id: 'tipo_cadastro_id',
        campo_nome: 'tipo_cadastro_nome',
        campo_pesquisa: 'tipo_cadastro_tipo',
        valor_pesquisa: 0
      };

      this.sub.push(this.dd.postDropdown3campos(d)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            ddTipoCadastroId = dados;
          },
          error: (erro) => {
            console.log(erro);
          },
          complete: () => {
            sessionStorage.setItem('dropdown-tipo_cadastro', JSON.stringify(ddTipoCadastroId));
            contador--;
            if (contador === 0) {
              this.resp.next(this.resposta);
            }
          }
        })
      );
    } else {
      contador--;
      if (contador === 0) {
        this.resp.next(this.resposta);
      }
    }

    // ****** tratamento_nome *****
    if (!sessionStorage.getItem('dropdown-tratamento')) {
      this.ddNomeIdArray.add('tratamento_nome', 'tratamento', 'tratamento_id', 'tratamento_nome');
    }
    // ****** grupo_nome *****
    if (!sessionStorage.getItem('dropdown-gupo')) {
      this.ddNomeIdArray.add('grupo_nome', 'grupo', 'grupo_id', 'grupo_nome');
    }
    // ****** municipio_nome *****
    if (!sessionStorage.getItem('dropdown-municipio')) {
      this.ddNomeIdArray.add('municipio_nome', 'municipio', 'municipio_id', 'municipio_nome');
    }
    // ****** regiao_nome *****
    if (!sessionStorage.getItem('dropdown-regiao')) {
      this.ddNomeIdArray.add('regiao_nome', 'regiao', 'regiao_id', 'regiao_nome');
    }
    // ****** estado_nome *****
    if (!sessionStorage.getItem('dropdown-estado')) {
      this.ddNomeIdArray.add('estado_nome', 'estado', 'estado_id', 'estado_nome');
    }
    // ****** estado_civil_nome *****
    if (!sessionStorage.getItem('dropdown-estado_civil')) {
      this.ddNomeIdArray.add('estado_civil_nome', 'estado_civil', 'estado_civil_id', 'estado_civil_nome');
    }
    // ****** escolaridade_nome *****
    if (!sessionStorage.getItem('dropdown-escolaridade')) {
      this.ddNomeIdArray.add('escolaridade_nome', 'escolaridade', 'escolaridade_id', 'escolaridade_nome');
    }
    // ****** campo4_nome *****
    if (!sessionStorage.getItem('dropdown-campo4')) {
      this.ddNomeIdArray.add('campo4_nome', 'campo4', 'campo4_id', 'campo4_nome');
    }

    if (this.ddNomeIdArray.count() > 0) {
      this.sub.push(this.dd.postDropdownNomeIdArray(this.ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            if (dados['tratamento_nome']) {
              sessionStorage.setItem('dropdown-tratamento', JSON.stringify(dados['tratamento_nome']));
            }
            if (dados['grupo_nome']) {
              sessionStorage.setItem('dropdown-grupo', JSON.stringify(dados['grupo_nome']));
            }
            if (dados['municipio_nome']) {
              sessionStorage.setItem('dropdown-municipio', JSON.stringify(dados['municipio_nome']));
            }
            if (dados['regiao_nome']) {
              sessionStorage.setItem('dropdown-regiao', JSON.stringify(dados['regiao_nome']));
            }
            if (dados['estado_nome']) {
              sessionStorage.setItem('dropdown-estado', JSON.stringify(dados['estado_nome']));
            }
            if (dados['estado_civil_nome']) {
              sessionStorage.setItem('dropdown-estado_civil', JSON.stringify(dados['estado_civil_nome']));
            }
            if (dados['escolaridade_nome']) {
              sessionStorage.setItem('dropdown-escolaridade', JSON.stringify(dados['escolaridade_nome']));
            }
            if (dados['campo4_nome']) {
              sessionStorage.setItem('dropdown-campo4', JSON.stringify(dados['campo4_nome']));
            }
          },
          error: (erro) => {
            console.error(erro);
          },
          complete: () => {
            contador--;
            if (contador === 0) {
              this.resp.next(this.resposta);
            }
          }
        }));
    } else {
      contador--;
      if (contador === 0) {
        this.resp.next(this.resposta);
      }
    }
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<number[]> {
    this.populaDados();
    return this.resp$
      .pipe(take(1),
        mergeMap((dados) => {
          return of(dados);
        }));
  }
}
