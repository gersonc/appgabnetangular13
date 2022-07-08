import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { DropdownnomeidClass, DropdownNomeIdJoin, DropdownsonomearrayClass } from '../../_models';
import { SolicitacaoDropdownMenuListar } from '../_models';
import {Observable, pipe, Subject, Subscription} from 'rxjs';
import { DropdownService } from '../../_services';

@Injectable({
  providedIn: 'root'
})

export class SolicitacaoDropdownMenuService {
  public ddNomeIdArray = new DropdownnomeidClass();
  public ddSoNomeArray = new DropdownsonomearrayClass();
  public ddSoDataArray = new DropdownsonomearrayClass();
  public ddNomeIdJoinArray = new DropdownNomeIdJoin();
  private ddSolicitacao = new SolicitacaoDropdownMenuListar();
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];
  inicio = true;
  /*public populaDropdownMenu = new Observable<boolean>((observer) => {
    const sub: Subscription[] = [];
    if (!sessionStorage.getItem('solicitacao-dropdown')) {
      let contador = 0;

      // ****** solicitacao_situacao *****
      this.ddSoNomeArray.add('ddSolicitacao_situacao', 'solicitacao', 'solicitacao_situacao');
      // ****** solicitacao_data *****
      this.ddSoNomeArray.add('ddSolicitacao_data', 'solicitacao', 'solicitacao_data');

      // ****** solicitacao_cadastro_tipo_id *****
      this.ddNomeIdArray.add('ddSolicitacao_cadastro_tipo_id', 'solicitacao', 'solicitacao_cadastro_tipo_id', 'solicitacao_cadastro_tipo_nome');
      // ****** solicitacao_cadastro_id *****
      this.ddNomeIdArray.add('ddSolicitacao_cadastro_id', 'solicitacao', 'solicitacao_cadastro_id', 'solicitacao_cadastro_nome');
      // ****** solicitacao_assunto_id *****
      this.ddNomeIdArray.add('ddSolicitacao_assunto_id', 'solicitacao', 'solicitacao_assunto_id', 'solicitacao_assunto_nome');
      // ****** solicitacao_atendente_cadastro_id *****
      this.ddNomeIdArray.add('ddSolicitacao_atendente_cadastro_id', 'solicitacao', 'solicitacao_atendente_cadastro_id', 'solicitacao_atendente_cadastro_nome');
      // ****** ddSolicitacao_cadastrante_cadastro *****
      this.ddNomeIdArray.add('ddSolicitacao_cadastrante_cadastro_id', 'solicitacao', 'solicitacao_cadastrante_cadastro_id', 'solicitacao_cadastrante_cadastro_nome');
      // ****** solicitacao_local*****
      this.ddNomeIdArray.add('ddSolicitacao_local_id', 'solicitacao', 'solicitacao_local_id', 'solicitacao_local_nome');
      // ****** solicitacao_tipo_recebimento *****
      this.ddNomeIdArray.add('ddSolicitacao_tipo_recebimento_id', 'solicitacao', 'solicitacao_tipo_recebimento_id', 'solicitacao_tipo_recebimento_nome');
      // ****** solicitacao_area_interesse *****
      this.ddNomeIdArray.add('ddSolicitacao_area_interesse_id', 'solicitacao', 'solicitacao_area_interesse_id', 'solicitacao_area_interesse_nome');
      // ****** solicitacao_reponsavel_analize *****
      this.ddNomeIdArray.add('ddSolicitacao_reponsavel_analize_id', 'solicitacao', 'solicitacao_reponsavel_analize_id', 'solicitacao_reponsavel_analize_nome');

      // ****** solicitacao_assunto_id *****
      this.ddNomeIdJoinArray.add('ddCadastro_municipio_id', 'cadastro', 'cadastro_municipio_id', 'cadastro_id', 'cadastro_municipio_nome', 'solicitacao', 'solicitacao_cadastro_id');
      // ****** cadastro_regiao *****
      this.ddNomeIdJoinArray.add('ddCadastro_regiao_id', 'cadastro', 'cadastro_regiao_id', 'cadastro_id', 'cadastro_regiao_nome', 'solicitacao', 'solicitacao_cadastro_id');

      sub.push(this.dd.postDropdownSoNomeArray(this.ddSoNomeArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddSolicitacao.ddSolicitacao_situacao = dados['ddSolicitacao_situacao'];
            this.ddSolicitacao.ddSolicitacao_data = dados['ddSolicitacao_data'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 3) {
              this.gravaDropDown();
              observer.next(true);
            }
          }
        })
      );

      sub.push(this.dd.postDropdownNomeIdArray(this.ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddSolicitacao.ddSolicitacao_cadastro_tipo_id = dados['ddSolicitacao_cadastro_tipo_id'];
            this.ddSolicitacao.ddSolicitacao_cadastro_id = dados['ddSolicitacao_cadastro_id'];
            this.ddSolicitacao.ddSolicitacao_assunto_id = dados['ddSolicitacao_assunto_id'];
            this.ddSolicitacao.ddSolicitacao_atendente_cadastro_id = dados['ddSolicitacao_atendente_cadastro_id'];
            this.ddSolicitacao.ddSolicitacao_cadastrante_cadastro_id = dados['ddSolicitacao_cadastrante_cadastro_id'];
            this.ddSolicitacao.ddSolicitacao_local_id = dados['ddSolicitacao_local_id'];
            this.ddSolicitacao.ddSolicitacao_tipo_recebimento_id = dados['ddSolicitacao_tipo_recebimento_id'];
            this.ddSolicitacao.ddSolicitacao_area_interesse_id = dados['ddSolicitacao_area_interesse_id'];
            this.ddSolicitacao.ddSolicitacao_reponsavel_analize_id = dados['ddSolicitacao_reponsavel_analize_id'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 3) {
              this.gravaDropDown();
              observer.next(true);
            }
          }
        })
      );

      sub.push(this.dd.postDropdownNomeIdJoinArray(this.ddNomeIdJoinArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddSolicitacao.ddCadastro_municipio_id = dados['ddCadastro_municipio_id'];
            this.ddSolicitacao.ddCadastro_regiao_id = dados['ddCadastro_regiao_id'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 3) {
              this.gravaDropDown();
              observer.next(true);
            }
          }
        })
      );

    } else {
      observer.next(true);
    }

      return {
        unsubscribe() {
          console.log('solicitacao resolver destroy');
          sub.forEach(s => s.unsubscribe());
        }
      };

    });*/




  constructor(
    private dd: DropdownService
  ) { }

  private getDropdownMenu() {
      let contador = 0;

      // ****** solicitacao_situacao *****
      this.ddSoNomeArray.add('ddSolicitacao_situacao', 'solicitacao', 'solicitacao_situacao');
      // ****** solicitacao_data *****
      this.ddSoNomeArray.add('ddSolicitacao_data', 'solicitacao', 'solicitacao_data');

      // ****** solicitacao_cadastro_tipo_id *****
      this.ddNomeIdArray.add('ddSolicitacao_cadastro_tipo_id', 'solicitacao', 'solicitacao_cadastro_tipo_id', 'solicitacao_cadastro_tipo_nome');
      // ****** solicitacao_cadastro_id *****
      this.ddNomeIdArray.add('ddSolicitacao_cadastro_id', 'solicitacao', 'solicitacao_cadastro_id', 'solicitacao_cadastro_nome');
      // ****** solicitacao_assunto_id *****
      this.ddNomeIdArray.add('ddSolicitacao_assunto_id', 'solicitacao', 'solicitacao_assunto_id', 'solicitacao_assunto_nome');
      // ****** solicitacao_atendente_cadastro_id *****
      this.ddNomeIdArray.add('ddSolicitacao_atendente_cadastro_id', 'solicitacao', 'solicitacao_atendente_cadastro_id', 'solicitacao_atendente_cadastro_nome');
      // ****** ddSolicitacao_cadastrante_cadastro *****
      this.ddNomeIdArray.add('ddSolicitacao_cadastrante_cadastro_id', 'solicitacao', 'solicitacao_cadastrante_cadastro_id', 'solicitacao_cadastrante_cadastro_nome');
      // ****** solicitacao_local*****
      this.ddNomeIdArray.add('ddSolicitacao_local_id', 'solicitacao', 'solicitacao_local_id', 'solicitacao_local_nome');
      // ****** solicitacao_tipo_recebimento *****
      this.ddNomeIdArray.add('ddSolicitacao_tipo_recebimento_id', 'solicitacao', 'solicitacao_tipo_recebimento_id', 'solicitacao_tipo_recebimento_nome');
      // ****** solicitacao_area_interesse *****
      this.ddNomeIdArray.add('ddSolicitacao_area_interesse_id', 'solicitacao', 'solicitacao_area_interesse_id', 'solicitacao_area_interesse_nome');
      // ****** solicitacao_reponsavel_analize *****
      this.ddNomeIdArray.add('ddSolicitacao_reponsavel_analize_id', 'solicitacao', 'solicitacao_reponsavel_analize_id', 'solicitacao_reponsavel_analize_nome');

      // ****** solicitacao_assunto_id *****
      this.ddNomeIdJoinArray.add('ddCadastro_municipio_id', 'cadastro', 'cadastro_municipio_id', 'cadastro_id', 'cadastro_municipio_nome', 'solicitacao', 'solicitacao_cadastro_id');
      // ****** cadastro_regiao *****
      this.ddNomeIdJoinArray.add('ddCadastro_regiao_id', 'cadastro', 'cadastro_regiao_id', 'cadastro_id', 'cadastro_regiao_nome', 'solicitacao', 'solicitacao_cadastro_id');

      this.sub.push(this.dd.postDropdownSoNomeArray(this.ddSoNomeArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddSolicitacao.ddSolicitacao_situacao = dados['ddSolicitacao_situacao'];
            this.ddSolicitacao.ddSolicitacao_data = dados['ddSolicitacao_data'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 3) {
              this.gravaDropDown();
              // observer.next(true);
            }
          }
        })
      );

      this.sub.push(this.dd.postDropdownNomeIdArray(this.ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddSolicitacao.ddSolicitacao_cadastro_tipo_id = dados['ddSolicitacao_cadastro_tipo_id'];
            this.ddSolicitacao.ddSolicitacao_cadastro_id = dados['ddSolicitacao_cadastro_id'];
            this.ddSolicitacao.ddSolicitacao_assunto_id = dados['ddSolicitacao_assunto_id'];
            this.ddSolicitacao.ddSolicitacao_atendente_cadastro_id = dados['ddSolicitacao_atendente_cadastro_id'];
            this.ddSolicitacao.ddSolicitacao_cadastrante_cadastro_id = dados['ddSolicitacao_cadastrante_cadastro_id'];
            this.ddSolicitacao.ddSolicitacao_local_id = dados['ddSolicitacao_local_id'];
            this.ddSolicitacao.ddSolicitacao_tipo_recebimento_id = dados['ddSolicitacao_tipo_recebimento_id'];
            this.ddSolicitacao.ddSolicitacao_area_interesse_id = dados['ddSolicitacao_area_interesse_id'];
            this.ddSolicitacao.ddSolicitacao_reponsavel_analize_id = dados['ddSolicitacao_reponsavel_analize_id'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 3) {
              this.gravaDropDown();
              // observer.next(true);
            }
          }
        })
      );

      this.sub.push(this.dd.postDropdownNomeIdJoinArray(this.ddNomeIdJoinArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddSolicitacao.ddSolicitacao_cadastro_municipio_id = dados['ddCadastro_municipio_id'];
            this.ddSolicitacao.ddSolicitacao_cadastro_regiao_id = dados['ddCadastro_regiao_id'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 3) {
              this.gravaDropDown();
              // observer.next(true);
            }
          }
        })
      );

  }

  gravaDropDown() {
    if (!sessionStorage.getItem('solicitacao-dropdown')) {
      if (!this.inicio) {
        sessionStorage.setItem('solicitacao-dropdown', JSON.stringify(this.ddSolicitacao));
        let ct = 0;
        this.sub.forEach(s => {
          ct++;
          s.unsubscribe()
          if (ct === 3) {
            this.resp.next(true);
            this.resp.complete();
          }
        });
      }
      if (this.inicio) {
        this.inicio = false;
        this.getDropdownMenu();
      }
    } else {
      this.resp.next(false);
      this.resp.complete();
    }
  }
}
