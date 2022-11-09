import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, NgForm, NgModel} from '@angular/forms';
import {EtiquetaClass, EtiquetaInterface} from '../_models';
import { EtiquetaConfigService } from '../_services';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {MsgService} from "../../_services/msg.service";

@Component({
  selector: 'app-etiqueta-form',
  templateUrl: './etiqueta-form.component.html',
  styleUrls: ['./etiqueta-form.component.css']
})
export class EtiquetaFormComponent implements OnInit, OnDestroy {
  @ViewChild('etqtForm', { static: false }) etqtForm: NgForm;
  @Output() hideForm = new EventEmitter<boolean>();
  etqForm: EtiquetaInterface;
  acao: string;
  mostraBtn = true;
  resp: any[] = [];
  sub: Subscription[] = [];
  formValido = false;
  btnDesativado = false;

  constructor(
    // private cs: CarregadorService,
    public ecs: EtiquetaConfigService,
    private ms: MsgService,
    // private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.acao = this.ecs.etqAcao;
    if (this.acao === 'INCLUIR') {
      this.etqForm = this.ecs.novaEtiqueta();
    }
    if (this.acao === 'ALTERAR') {
      this.etqForm = this.ecs.etqForm;
    }
  }


  cancelar() {
    this.ecs.etqExecutado = false;
    this.hideForm.emit(false);
  }

  incluirEtiqueta(et: EtiquetaInterface) {
      this.sub.push(this.ecs.incluir(et)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            if (this.resp[0]) {
              this.etqForm.etq_id = +this.resp[1];
              this.ecs.etiquetas.push(this.etqForm);
              this.ecs.etiquetas.sort((a, b) => (a.etq_marca+a.etq_modelo > b.etq_marca+b.etq_modelo) ? 1 : ((b.etq_marca+b.etq_modelo > a.etq_marca+a.etq_modelo) ? -1 : 0));
              sessionStorage.setItem('dropdown-etiqueta', JSON.stringify(this.ecs.listToDrop(this.ecs.etiquetas)));
              this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'INCLUIR', detail: this.resp[2]});
              this.hideForm.emit(false);
            } else {
              this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'INCLUIR', detail: this.resp[2]});
              this.mostraBtn = true;
              this.btnDesativado = false;
            }
          }
        })
      );

  }

  alterarEtiqueta(et: EtiquetaInterface) {
      this.sub.push(this.ecs.alterar(et)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            if (this.resp[0]) {
              this.ecs.etqExecutado = true;
              this.ecs.etiquetas[this.ecs.idx] = this.etqForm;
              this.ecs.etiquetas.sort((a, b) => (a.etq_marca+a.etq_modelo > b.etq_marca+b.etq_modelo) ? 1 : ((b.etq_marca+b.etq_modelo > a.etq_marca+a.etq_modelo) ? -1 : 0));
              sessionStorage.setItem('dropdown-etiqueta', JSON.stringify(this.ecs.listToDrop(this.ecs.etiquetas)));
              this.ms.add({key: 'toastprincipal', severity: 'info', summary: 'ALTERAR', detail: this.resp[2]});
              this.hideForm.emit(false);
            } else {
              this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ALTERAR', detail: this.resp[2]});
              this.mostraBtn = true;
              this.btnDesativado = false;
            }
          }
        })
      );
  }

  onSubmit(f: NgForm) {
    this.btnDesativado = true;
    this.mostraBtn = false;
    if (this.verificaValidacoesForm(f.form)) {
      this.criarEnvio(f.value);
    } else {
      this.mostraBtn = true;
      this.btnDesativado = false;
    }
  }

  verificaValidacoesForm(formGroup: FormGroup): boolean {
    let vf = true;
    let ct = 0;
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.controls[campo];
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      } else {
        ct++;
        if (controle.invalid) {
          vf = false;
        }
      }
    });
    if (ct === 12) {
      return vf;
    }
  }

  verificaValidTouched(campo: NgModel) {
    return !campo.control.valid && (campo.control.touched || campo.control.valid);
  }

  aplicaCssErro(campo: NgModel) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };



  }

  onToastClose(ev) {
    if (this.ecs.etqExecutado) {
      this.sub.forEach(s => s.unsubscribe());
      this.ecs.formDisplay = false;
    }
  }

  criarEnvio(e: EtiquetaInterface) {
    if (this.ecs.etqAcao === 'INCLUIR') {
      e.etq_marca = e.etq_marca.toUpperCase();
      e.etq_modelo = e.etq_modelo.toUpperCase();
      this.etqForm = e;
      if (this.ecs.etiquetas.findIndex(t => t.etq_marca.toUpperCase() === e.etq_marca && t.etq_modelo.toUpperCase() === e.etq_modelo) !== -1) {
        this.mostraBtn = true;
        this.btnDesativado = false;
        this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ALTERAR', detail: 'Dados inválidos'});
      } else {
        this.incluirEtiqueta(this.etqForm);
      }
      console.log('criarEnvio', e);
    }
    if (this.ecs.etqAcao === 'ALTERAR') {
      e.etq_id = this.ecs.etqForm.etq_id;
      e.etq_marca = e.etq_marca.toUpperCase();
      e.etq_modelo = e.etq_modelo.toUpperCase();
      if (
        this.etqForm.etq_marca.toUpperCase() === e.etq_marca.toUpperCase() &&
        this.etqForm.etq_modelo.toUpperCase() === e.etq_modelo.toUpperCase() &&
        +this.etqForm.etq_margem_superior === +e.etq_margem_superior &&
        +this.etqForm.etq_margem_lateral === +e.etq_margem_lateral &&
        +this.etqForm.etq_distancia_vertical === +e.etq_distancia_vertical &&
        +this.etqForm.etq_distancia_horizontal === +e.etq_distancia_horizontal &&
        +this.etqForm.etq_altura === +e.etq_altura &&
        +this.etqForm.etq_largura === +e.etq_largura &&
        +this.etqForm.etq_linhas === +e.etq_linhas &&
        +this.etqForm.etq_colunas === +e.etq_colunas &&
        +this.etqForm.etq_folha_horz === +e.etq_folha_horz &&
        +this.etqForm.etq_folha_vert === +e.etq_folha_vert
      ) {
        this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ALTERAR', detail: 'Sem alteração'});
        this.mostraBtn = true;
        this.btnDesativado = false;
      } else {
        this.etqForm = e;
        this.alterarEtiqueta(this.etqForm);
        console.log('criarEnvio', e);
      }
    }
  }

  ngOnDestroy(): void {
    delete this.ecs.etqAcao;
    delete this.ecs.etqForm;
    delete this.ecs.idx;
    this.sub.forEach(s => s.unsubscribe());
  }


}
