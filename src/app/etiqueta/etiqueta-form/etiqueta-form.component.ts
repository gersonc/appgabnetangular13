import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
export class EtiquetaFormComponent implements OnInit {
  @ViewChild('etqForm', { static: true }) etqtForm: FormGroup;
  etqForm: EtiquetaInterface;
  acao: string;
  mostraBtn = true;
  resp: any[] = [];
  sub: Subscription[] = [];


  constructor(
    // private cs: CarregadorService,
    public ecs: EtiquetaConfigService,
    private ms: MsgService,
    // private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.etqForm = this.ecs.etqForm;
    this.acao = this.ecs.etqAcao;
    if (this.acao === 'INCLUIR') {
      this.ecs.etqForm.etq_id = 0;
    }
  }


  cancelar() {
    this.ecs.etqExecutado = false;
    this.ecs.formDisplay = false;
  }

  incluirEtiqueta(et: EtiquetaClass) {
    this.mostraBtn = false;
    if (this.verificaRequired()) {
      this.sub.push(this.ecs.incluir(et)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            if (this.resp[0]) {
              this.ecs.etqExecutado = true;
              this.ecs.etqForm.etq_marca = this.ecs.etqForm.etq_marca.toString().toUpperCase();
              this.ecs.etqForm.etq_modelo = this.ecs.etqForm.etq_modelo.toString().toUpperCase();
              this.ecs.etqForm.etq_id = +this.resp[1];
              this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'INCLUIR', detail: this.resp[2]});
              // this.messageService.add({key: 'msgForm', severity: 'info', summary: 'INCLUIR: ', detail: this.resp[2]});
            } else {
              this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'INCLUIR', detail: this.resp[2]});
              // this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'INCLUIR: ', detail: this.resp[2]});
              this.mostraBtn = true;
            }
          }
        })
      );
    } else {
      this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'INCLUIR', detail: 'Dados inválidos'});
      // this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'INCLUIR: ', detail: 'Dados inválidos'});
      this.mostraBtn = true;
    }

  }

  alterarEtiqueta(et: EtiquetaClass) {
    this.mostraBtn = false;
    if (this.verificaRequired()) {
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
              this.ecs.etqForm.etq_marca = this.ecs.etqForm.etq_marca.toString().toUpperCase();
              this.ecs.etqForm.etq_modelo = this.ecs.etqForm.etq_modelo.toString().toUpperCase();
              this.ms.add({key: 'toastprincipal', severity: 'info', summary: 'ALTERAR', detail: this.resp[2]});
              // this.messageService.add({key: 'msgForm', severity: 'info', summary: 'ALTERAR: ', detail: this.resp[2]});
            } else {
              this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ALTERAR', detail: this.resp[2]});
              // this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'ALTERAR: ', detail: this.resp[2]});
              this.mostraBtn = true;
            }
          }
        })
      );
    } else {
      this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ALTERAR', detail:'Dados inválidos'});
      // this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'ALTERAR: ', detail: 'Dados inválidos'});
      this.mostraBtn = true;
    }
  }

  onSubmit() {
    console.log('verificaRequired()', this.verificaRequired());
    if (this.verificaRequired()) {
      this.criarEnvio(this.ecs.etqForm);
    }
    /*if (this.ecs.etqAcao === 'INCLUIR') {
      this.incluirEtiqueta(this.ecs.etqForm);
    }
    if (this.ecs.etqAcao === 'ALTERAR') {
      this.alterarEtiqueta(this.ecs.etqForm);
    }*/
  }

  verificaRequired(): boolean {
    for (const controlsKey in this.etqtForm.controls) {
      this.aplicaCssErro(controlsKey);
    }
      return this.etqtForm.valid;
  }

  verificaValidTouched(campo) {
    return !campo.valid && campo.touched;
  }

  aplicaCssErro(campo) {
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
    console.log('criarEnvio',e);
  }


}
