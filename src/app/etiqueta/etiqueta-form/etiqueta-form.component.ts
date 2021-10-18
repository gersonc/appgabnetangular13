import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EtiquetaClass } from '../_models';
import { CarregadorService } from '../../_services';
import { EtiquetaConfigService } from '../_services';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-etiqueta-form',
  templateUrl: './etiqueta-form.component.html',
  styleUrls: ['./etiqueta-form.component.css']
})
export class EtiquetaFormComponent implements OnInit {
  @ViewChild('etqForm', { static: true }) etqtForm: FormGroup;
  etqForm: EtiquetaClass;
  acao: string;
  mostraBtn = true;
  resp: any[] = [];
  sub: Subscription[] = [];


  constructor(
    private cs: CarregadorService,
    public ecs: EtiquetaConfigService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.acao = this.ecs.etqAcao;
    if (this.acao === 'INCLUIR') {
      this.ecs.etqForm = new EtiquetaClass();
      this.ecs.etqForm.etq_id = 0;
    }
  }


  cancelar() {
    console.log('cancelar', this.ecs.etqForm);
    this.ecs.etqExecutado = false;
    this.ecs.formDisplay = false;
  }

  incluirEtiqueta(et: EtiquetaClass) {
    this.mostraBtn = false;
    if (this.verificaRequired()) {
      this.messageService.clear('msgForm');
      this.cs.mostraCarregador();
      this.sub.push(this.ecs.incluir(et)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            this.cs.escondeCarregador();
            if (this.resp[0]) {
              this.ecs.etqExecutado = true;
              this.ecs.etqForm.etq_marca = this.ecs.etqForm.etq_marca.toString().toUpperCase();
              this.ecs.etqForm.etq_modelo = this.ecs.etqForm.etq_modelo.toString().toUpperCase();
              this.ecs.etqForm.etq_id = +this.resp[1];
              this.messageService.add({key: 'msgForm', severity: 'info', summary: 'INCLUIR: ', detail: this.resp[2]});
            } else {
              this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'INCLUIR: ', detail: this.resp[2]});
              this.mostraBtn = true;
            }
          }
        })
      );
    } else {
      this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'INCLUIR: ', detail: 'Dados inválidos'});
      this.mostraBtn = true;
    }

  }

  alterarEtiqueta(et: EtiquetaClass) {
    this.mostraBtn = false;
    if (this.verificaRequired()) {
      this.messageService.clear('msgForm');
      this.cs.mostraCarregador();
      this.sub.push(this.ecs.alterar(et)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            this.cs.escondeCarregador();
            if (this.resp[0]) {
              this.ecs.etqExecutado = true;
              this.ecs.etqForm.etq_marca = this.ecs.etqForm.etq_marca.toString().toUpperCase();
              this.ecs.etqForm.etq_modelo = this.ecs.etqForm.etq_modelo.toString().toUpperCase();
              this.messageService.add({key: 'msgForm', severity: 'info', summary: 'ALTERAR: ', detail: this.resp[2]});
            } else {
              this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'ALTERAR: ', detail: this.resp[2]});
              this.mostraBtn = true;
            }
          }
        })
      );
    } else {
      this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'ALTERAR: ', detail: 'Dados inválidos'});
      this.mostraBtn = true;
    }
  }

  onSubmit() {
    if (this.ecs.etqAcao === 'INCLUIR') {
      this.incluirEtiqueta(this.ecs.etqForm);
    }
    if (this.ecs.etqAcao === 'ALTERAR') {
      this.alterarEtiqueta(this.ecs.etqForm);
    }
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
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  onToastClose(ev) {
    if (this.ecs.etqExecutado) {
      this.sub.forEach(s => s.unsubscribe());
      this.ecs.formDisplay = false;
    }
  }


}
