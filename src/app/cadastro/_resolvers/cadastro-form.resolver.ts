import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { SelectItem, SelectItemGroup} from 'primeng/api';
import {DdService} from "../../_services/dd.service";
import {CadastroFormService} from "../_services/cadastro-form.service";
import {CadastroService} from "../_services/cadastro.service";
import {CadastroFormI} from "../_models/cadastro-form-i";

@Injectable({
  providedIn: 'root'
})
export class CadastroFormResolver implements Resolve<boolean | never> {
  private sub: Subscription[] = [];
  resp: Subject<boolean>;
  resp$: Observable<boolean>
  private cf?: CadastroFormI;
  private cadastro_id = 0;

  ddCadastroSexo: SelectItem[] = [
    {label: 'MASCULINO', value: 'M'},
    {label: 'FEMININO', value: 'F'},
    {label: 'OUTROS', value: 'O'},
    {label: 'PJ', value: 'P'}
  ];

  dds: string[] = [];
  ct = 0;
  private contador = 0;

  constructor(
    private router: Router,
    private dd: DdService,
    private cfs: CadastroFormService,
    private cadastroService: CadastroService,
  ) { }


  espera(v: boolean) {
    this.resp.next(v);
    this.resp.complete();
  }


  carregaDropDown(): boolean {

    this.dds = [];
    this.resp = new Subject<boolean>();
    this.resp$ = this.resp.asObservable();

    // ****** sexo *****
    if (!sessionStorage.getItem('dropdown-sexo')) {
      sessionStorage.setItem('dropdown-sexo', JSON.stringify(this.ddCadastroSexo));
    }
    // ****** tipo_cadastro *****
    if (!sessionStorage.getItem('dropdown-tipo_cadastro')) {
      this.dds.push('dropdown-tipo_cadastro');
    }
    // ****** tratamento_nome *****
    if (!sessionStorage.getItem('dropdown-tratamento')) {
      this.dds.push('dropdown-tratamento');
    }
    // ****** grupo_nome *****
    if (!sessionStorage.getItem('dropdown-grupo')) {
      this.dds.push('dropdown-grupo');
    }
    // ****** municipio_nome *****
    if (!sessionStorage.getItem('dropdown-municipio')) {
      this.dds.push('dropdown-municipio');
    }
    // ****** regiao_nome *****
    if (!sessionStorage.getItem('dropdown-regiao')) {
      this.dds.push('dropdown-regiao');
    }
    // ****** estado_nome *****
    if (!sessionStorage.getItem('dropdown-estado')) {
      this.dds.push('dropdown-estado');
    }
    // ****** estado_civil_nome *****
    if (!sessionStorage.getItem('dropdown-estado_civil')) {
      this.dds.push('dropdown-estado_civil');
    }
    // ****** escolaridade_nome *****
    if (!sessionStorage.getItem('dropdown-escolaridade')) {
      this.dds.push('dropdown-escolaridade');
    }
    // ****** campo4_nome *****
    if (!sessionStorage.getItem('dropdown-campo4')) {
      this.dds.push('dropdown-campo4');
    }

    if (this.dds.length > 0) {
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.dds.forEach(nome => {
              sessionStorage.setItem(nome, JSON.stringify(dados[nome]));
            });
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            this.espera(true);
          }
        })
      );
      return true;
    } else {
      return false
    }
  }


  onDestroy(): void {
    this.dds = [];
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | never> {

    if (this.cfs.acao === 'incluir') {
      // this.efs.resetEmenda();
    }
    if (this.carregaDropDown()) {
      return this.resp$.pipe(
        take(1),
        mergeMap(dados => {
          this.onDestroy();
          return of(dados);
        })
      );
    } else {
      this.onDestroy();
      return of(false);
    }

  }
}
