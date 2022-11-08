import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NucleoService } from '../_services/nucleo.service';
import { LocalClass } from '../_models/nucleo';
import { SelectItem } from 'primeng/api';
import { DropdownService } from '../../_services';
import {MsgService} from "../../_services/msg.service";
import {DdService} from "../../_services/dd.service";

@Component({
  selector: 'app-nucleo-form',
  templateUrl: './nucleo-form.component.html',
  styleUrls: ['./nucleo-form.component.css']
})
export class NucleoFormComponent implements OnInit {
  @ViewChild('nForm', { static: true }) nForm: FormGroup;
  nuForm: LocalClass;
  resp: any[] = [];
  sub: Subscription[] = [];
  public ddUsuario_id: SelectItem[];

  constructor(
    // private cs: CarregadorService,
    // private messageService: MessageService,
    private ms: MsgService,
    public ns: NucleoService,
    // private dd: DropdownService
    private dd: DdService,
  ) { }

  ngOnInit(): void {
    this.ns.nuMostraBt = true;
    this.carregaDropDown();
    if (this.ns.nuAcao === 'INCLUIR') {
      this.ns.nuForm = new LocalClass();
      this.ns.nuForm.local_id = 0;
    }
  }

  carregaDropDown() {
    this.ns.nuMostraBt = true;
    if (!sessionStorage.getItem('dropdown-usuario')) {
      //this.sub.push(this.dd.postDropdownNomeId({tabela: 'usuario', campo_id: 'usuario_id', campo_nome: 'usuario_nome'})
      this.sub.push(this.dd.getDd('dropdown-usuario')
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddUsuario_id = dados;
          },
          error1 => {
            console.log('erro');
          },
          () => {
            sessionStorage.setItem('dropdown-usuario', JSON.stringify(this.ddUsuario_id));
          })
      );
    } else {
      this.ddUsuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario'));
    }
  }

  cancelar() {
    this.ns.nuExecutado = false;
    this.ns.formDisplay = false;
  }

  incluirNucleo(et: LocalClass) {
    this.ns.nuMostraBt = false;
    if (this.verificaRequired()) {
      this.sub.push(this.ns.incluir(et)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            if (this.resp[0]) {
              this.ns.nuExecutado = true;
              this.ns.nuForm.local_nome = this.ns.nuForm.local_nome.toString().toUpperCase();
              if (this.ns.nuForm.local_endereco) {
                this.ns.nuForm.local_endereco = this.ns.nuForm.local_endereco.toString().toUpperCase();
              }
              if (this.ns.nuForm.local_telefone) {
                this.ns.nuForm.local_telefone = this.ns.nuForm.local_telefone.toString().toUpperCase();
              }
              if (this.ns.nuForm.local_color) {
                this.ns.nuForm.local_color = this.ns.nuForm.local_color.toString().toUpperCase();
              }
              this.ns.nuForm.local_id = +this.resp[1];
              this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'INCLUIR', detail: this.resp[2]});
              // this.messageService.add({key: 'msgForm', severity: 'info', summary: 'INCLUIR: ', detail: this.resp[2]});
            } else {
              this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'INCLUIR', detail: this.resp[2]});
              // this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'INCLUIR: ', detail: this.resp[2]});
              this.ns.nuMostraBt = true;
            }
          }
        })
      );
    } else {
      this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'INCLUIR', detail: this.resp[2]});
      // this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'INCLUIR: ', detail: 'Dados inválidos'});
      this.ns.nuMostraBt = true;
    }

  }

  alterarNucleo(et: LocalClass) {
    this.ns.nuMostraBt = false;
    if (this.verificaRequired()) {
      this.sub.push(this.ns.alterar(et)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            if (this.resp[0]) {
              this.ns.nuExecutado = true;
              this.ns.nuForm.local_nome = this.ns.nuForm.local_nome.toString().toUpperCase();
              if (this.ns.nuForm.local_endereco) {
                this.ns.nuForm.local_endereco = this.ns.nuForm.local_endereco.toString().toUpperCase();
              }
              if (this.ns.nuForm.local_telefone) {
                this.ns.nuForm.local_telefone = this.ns.nuForm.local_telefone.toString().toUpperCase();
              }
              if (this.ns.nuForm.local_color) {
                this.ns.nuForm.local_color = this.ns.nuForm.local_color.toString().toUpperCase();
              }
              this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'ALTERAR', detail: this.resp[2]});
              // this.messageService.add({key: 'msgForm', severity: 'info', summary: 'ALTERAR: ', detail: this.resp[2]});
            } else {
              this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ALTERAR', detail: this.resp[2]});
              // this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'ALTERAR: ', detail: this.resp[2]});
              this.ns.nuMostraBt = true;
            }
          }
        })
      );
    } else {
      this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ALTERAR', detail: 'Dados inválidos'});
      // this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'ALTERAR: ', detail: 'Dados inválidos'});
      this.ns.nuMostraBt = true;
    }
  }

  onSubmit() {
    if (this.ns.nuAcao === 'INCLUIR') {
      this.incluirNucleo(this.ns.nuForm);
    }
    if (this.ns.nuAcao === 'ALTERAR') {
      this.alterarNucleo(this.ns.nuForm);
    }
  }

  verificaRequired(): boolean {
    for (const controlsKey in this.nForm.controls) {
      this.aplicaCssErro(controlsKey);
    }
    return this.nForm.valid;
  }

  /*verificaValidTouched(campo) {
    return !campo.valid && campo.touched;
  }*/

  verificaValidTouched(campo) {
    return (
      !campo.valid &&
      (campo.touched || campo.dirty)
    );
  }

  verificaValidacoesForm() {
    Object.keys(this.nForm.controls).forEach(campo => {
      const controle = this.nForm.controls[campo];
      controle.markAsDirty();
      controle.markAsTouched();
    });
  }

  aplicaCssErro(campo) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  onToastClose(ev) {
    this.ddUsuario_id.forEach((d) => {
      if (d.value === this.ns.nuForm.local_responsavel_usuario_id) {
        this.ns.nuForm.local_responsavel_usuario_nome = d.label;
      }
    });
    if (this.ns.nuExecutado) {
      this.sub.forEach(s => s.unsubscribe());
      this.ns.formDisplay = false;
    }
  }


}

