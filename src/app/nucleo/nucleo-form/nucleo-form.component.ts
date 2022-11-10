import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup, NgForm, NgModel} from '@angular/forms';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NucleoService } from '../_services/nucleo.service';
import {LocalInterface} from '../_models/nucleo';
import { SelectItem } from 'primeng/api';
import {MsgService} from "../../_services/msg.service";

@Component({
  selector: 'app-nucleo-form',
  templateUrl: './nucleo-form.component.html',
  styleUrls: ['./nucleo-form.component.css']
})
export class NucleoFormComponent implements OnInit {
  @Output() hideForm = new EventEmitter<boolean>();
  @ViewChild('nForm', { static: true }) nForm: FormGroup;
  nuForm: LocalInterface = this.ns.nuForm;
  nucleo: LocalInterface = null;
  resp: any[] = [];
  sub: Subscription[] = [];
  btnDesativado = false;

  constructor(
    private ms: MsgService,
    public ns: NucleoService,
  ) {}

  ngOnInit(): void {
    this.nForm.reset(this.ns.nuForm,  {
      onlySelf: false,
      emitEvent: true
    });
    this.ns.nuMostraBt = true;
    this.carregaDropDown();
    if (this.ns.nuAcao === 'INCLUIR') {
      this.nucleo = this.ns.newNucleo();
    }
    if (this.ns.nuAcao === 'ALTERAR') {
      const n: LocalInterface = {...this.ns.nuForm};
      this.nucleo = {...n};
    }

  }

  carregaDropDown() {
    this.ns.ddUsuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario'));
    this.ns.ddnucleo = JSON.parse(sessionStorage.getItem('dropdown-local'));
  }

  onSubmit(nForm: NgForm) {
    this.btnDesativado = true;
    if (this.verificaValidacoesForm(nForm.form) && this.criaEnvio(nForm.form.value)) {
      if (this.ns.nuAcao === 'INCLUIR') {
        this.incluirNucleo();
      }
      if (this.ns.nuAcao === 'ALTERAR') {
        this.alterarNucleo();
      }
    } else {
      this.btnDesativado = false;
    }
    this.criaEnvio(nForm.form.value);
  }

  criaEnvio(nForm): boolean {
    if (this.ns.nuForm.local_nome !== null) {
      this.ns.nuForm.local_nome = this.ns.nuForm.local_nome.toUpperCase();
    }
    if(this.ns.nuAcao === 'INCLUIR') {
      if (this.ns.nuForm.local_nome === null || this.ns.nuForm.local_nome.length < 4) {
        return false;
      } else {
        const n = this.ns.locais.findIndex(l => l.local_nome === this.ns.nuForm.local_nome);
        if (n !== -1) {
          return false;
        }
      }
      if (this.ns.nuForm.local_endereco !== null) {
        this.ns.nuForm.local_endereco = this.ns.nuForm.local_endereco.toUpperCase();
      }
      if (this.ns.nuForm.local_telefone !== null) {
        this.ns.nuForm.local_telefone = this.ns.nuForm.local_telefone.toUpperCase();
      }
      if (this.ns.nuForm.local_color !== null) {
        this.ns.nuForm.local_color = this.ns.nuForm.local_color.toUpperCase();
      }
      delete this.ns.nuForm.local_id;
      delete this.ns.nuForm.local_responsavel_usuario_nome;
      return true;
    }
    if(this.ns.nuAcao === 'ALTERAR') {
      if (this.nucleo === this.ns.nuForm) {
        return false;
      }
      if (this.ns.nuForm.local_nome === null || this.ns.nuForm.local_nome.length < 4) {
        return false;
      } else {
        this.ns.nuForm.local_nome = this.ns.nuForm.local_nome.toUpperCase();
      }
      if (this.ns.nuForm.local_endereco !== null) {
        this.ns.nuForm.local_endereco = this.ns.nuForm.local_endereco.toUpperCase();
      }
      if (this.ns.nuForm.local_telefone !== null) {
        this.ns.nuForm.local_telefone = this.ns.nuForm.local_telefone.toUpperCase();
      }
      if (this.ns.nuForm.local_color !== null) {
        this.ns.nuForm.local_color = this.ns.nuForm.local_color.toUpperCase();
      }
      delete this.ns.nuForm.local_responsavel_usuario_nome;
      return true;
    }
  }

  reset() {
    this.nForm.reset(this.nucleo,  {
      onlySelf: false,
      emitEvent: true
    });
    this.ns.nuForm = this.nucleo;
    this.btnDesativado = false;
  }

  cancelar() {
    this.hideForm.emit(false);
  }

  incluirNucleo() {
      this.sub.push(this.ns.incluir(this.ns.nuForm)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            if (this.resp[0]) {
              this.ns.nuForm = this.resp[3];
              this.ns.locais.push(this.ns.nuForm);
              this.ns.locais.sort((a, b) => (a.local_nome > b.local_nome) ? 1 : ((b.local_nome > a.local_nome) ? -1 : 0));
              this.ns.ddnucleo = this.setDrop(this.ns.locais);
              sessionStorage.setItem('dropdown-local', JSON.stringify(this.ns.ddnucleo));
              this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'INCLUIR', detail: this.resp[2]});
              this.cancelar();
            } else {
              this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'INCLUIR', detail: this.resp[2]});
              this.reset();
            }
          }
        })
      );
  }

  alterarNucleo() {
      this.sub.push(this.ns.alterar(this.ns.nuForm)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            if (this.resp[0]) {
              this.ns.nuForm = this.resp[3];
              this.ns.locais[this.ns.idx] = this.ns.nuForm;
              this.ns.locais.sort((a, b) => (a.local_nome > b.local_nome) ? 1 : ((b.local_nome > a.local_nome) ? -1 : 0));
              this.ns.ddnucleo = this.setDrop(this.ns.locais);
              sessionStorage.setItem('dropdown-local', JSON.stringify(this.ns.ddnucleo));
              this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'ALTERAR', detail: this.resp[2]});
              this.cancelar();
            } else {
              this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ALTERAR', detail: this.resp[2]});
              this.reset();
            }
          }
        })
      );
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
    if (ct === 6) {
      return vf;
    }
  }

  setDrop(d: LocalInterface[]): SelectItem[] {
    return d.map((n) =>{
      return {
        label: n.local_nome,
        value: n.local_id
      }
    });
  }

}

