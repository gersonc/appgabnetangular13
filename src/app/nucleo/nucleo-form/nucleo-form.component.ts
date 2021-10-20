import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CarregadorService } from '../../_services';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NucleoService } from '../_services/nucleo.service';
import { LocalClass, LocalInterface } from '../_models/nucleo';
import { MessageService, SelectItem } from 'primeng/api';
import { DropdownService } from '../../_services';

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
    private cs: CarregadorService,
    private messageService: MessageService,
    public ns: NucleoService,
    private dd: DropdownService
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
      this.sub.push(this.dd.postDropdownNomeId({tabela: 'usuario', campo_id: 'usuario_id', campo_nome: 'usuario_nome'})
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
      this.messageService.clear('msgForm');
      this.cs.mostraCarregador();
      this.sub.push(this.ns.incluir(et)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            this.cs.escondeCarregador();
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
              this.messageService.add({key: 'msgForm', severity: 'info', summary: 'INCLUIR: ', detail: this.resp[2]});
            } else {
              this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'INCLUIR: ', detail: this.resp[2]});
              this.ns.nuMostraBt = true;
            }
          }
        })
      );
    } else {
      this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'INCLUIR: ', detail: 'Dados inválidos'});
      this.ns.nuMostraBt = true;
    }

  }

  alterarNucleo(et: LocalClass) {
    this.ns.nuMostraBt = false;
    if (this.verificaRequired()) {
      this.messageService.clear('msgForm');
      this.cs.mostraCarregador();
      this.sub.push(this.ns.alterar(et)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            this.cs.escondeCarregador();
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
              this.messageService.add({key: 'msgForm', severity: 'info', summary: 'ALTERAR: ', detail: this.resp[2]});
            } else {
              this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'ALTERAR: ', detail: this.resp[2]});
              this.ns.nuMostraBt = true;
            }
          }
        })
      );
    } else {
      this.messageService.add({key: 'msgForm', severity: 'warn', summary: 'ALTERAR: ', detail: 'Dados inválidos'});
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

