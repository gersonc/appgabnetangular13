import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService, CarregadorService } from '../../_services';
import { DropdownService } from '../../_services';
import { MessageService, SelectItem } from 'primeng/api';
import { take } from 'rxjs/operators';
import { UsuarioService } from '../_services/usuario.service';
import { Usuario } from '../_models/usuario';


@Component({
  selector: 'app-usuario-incluir',
  templateUrl: './usuario-incluir.component.html',
  styleUrls: ['./usuario-incluir.component.css']
})
export class UsuarioIncluirComponent implements OnInit, OnDestroy {

  formUsuario: FormGroup;
  ddUsuario_local_id: SelectItem[] = [];
  ddSimNao: SelectItem[] = [];
  sub: Subscription[] = [];
  botaoEnviarVF = false;
  resp: any[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    public aut: AuthenticationService,
    private cs: CarregadorService,
    private dd: DropdownService,
    private us: UsuarioService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getDropDown();
    this.criaForm();
  }

  getDropDown() {
    const sn0: SelectItem = {
      label: 'Não',
      value: 0
    };
    const sn1: SelectItem = {
      label: 'Sim',
      value: 1
    };
    this.ddSimNao.push(sn0);
    this.ddSimNao.push(sn1);
    if (!sessionStorage.getItem('dropdown-local')) {
      this.sub.push(
        this.dd.getDropdownNomeId('local', 'local_id', 'local_nome')
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              sessionStorage.setItem('dropdown-local', JSON.stringify(dados));
              this.ddUsuario_local_id = dados;
            }
          })
      );
    } else {
      this.ddUsuario_local_id = JSON.parse(<string>sessionStorage.getItem('dropdown-local'));
    }
  }

  criaForm() {
    if (!this.us.usuario!.usuario_local_id) {
      this.us.usuario!.usuario_local_id = this.aut.usuario_local_id;
    }
    this.formUsuario = this.formBuilder.group({
      usuario_nome: [this.us.usuario?.usuario_nome, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      usuario_login: [this.us.usuario?.usuario_login, [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
      usuario_email: [this.us.usuario?.usuario_email, [Validators.required, Validators.email]],
      usuario_celular: [this.us.usuario?.usuario_celular, Validators.required],
      usuario_cargo: [this.us.usuario?.usuario_cargo, Validators.required],
      usuario_local_id: [this.us.usuario?.usuario_local_id, Validators.required],
      usuario_responsavel_sn: [this.us.usuario?.usuario_responsavel_sn],
      usuario_principal_sn: [this.us.usuario?.usuario_principal_sn],
      usuario_acesso: [this.us.usuario?.usuario_acesso2],
      usuario_senha: [this.us.usuario?.usuario_senha, [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
    });
  }

  onSubmit() {
    this.botaoEnviarVF = true;
    this.cs.mostraCarregador();
    this.sub.push(this.us.incluir(this.criaEnvio())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.cs.escondeCarregador();
          // @ts-ignore
          this.messageService.add({key: 'usuarioToast', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
          console.error(err);
          this.cancelar();
        },
        complete: () => {
          this.cs.escondeCarregador();
          // @ts-ignore
          if (this.resp[0]) {
            this.messageService.add({
              key: 'usuarioToast',
              severity: 'success',
              summary: 'INCLUIR USUÁRIO',
              // @ts-ignore
              detail: this.resp[2]
            });
            this.cancelar();
          } else {
            // @ts-ignore
            console.error('ERRO - INCLUIR ', this.resp[2]);
            this.messageService.add({
              key: 'usuarioToast',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              // @ts-ignore
              detail: this.resp[2]
            });
            this.cancelar();
          }
        }
      })
    );

  }

  cancelar() {
    this.resp = [];
    this.sub.forEach(s => s.unsubscribe());
    this.formUsuario!.reset();
    this.us.novoUsuario();
    this.botaoEnviarVF = false;
    window.scrollTo(0, 0);
  }

  sair() {
    this.cancelar();
    this.us.acao = 'listar';
  }

  criaEnvio(): Usuario {
    const user = new Usuario();
    user.usuario_nome = this.formUsuario!.get('usuario_nome')!.value;
    user.usuario_local_id = this.formUsuario!.get('usuario_local_id')!.value;
    user.usuario_login = this.formUsuario!.get('usuario_login')!.value;
    user.usuario_senha = this.formUsuario!.get('usuario_senha')!.value;
    user.usuario_email = this.formUsuario!.get('usuario_email')!.value;
    user.usuario_cargo = this.formUsuario!.get('usuario_cargo')!.value;
    user.usuario_responsavel_sn = this.formUsuario!.get('usuario_responsavel_sn')!.value;
    user.usuario_principal_sn = this.formUsuario!.get('usuario_principal_sn')!.value;
    user.usuario_acesso = this.us.escreverAcesso(this.formUsuario!.get('usuario_acesso')!.value);
    // user.usuario_acesso = '1111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
    user.usuario_cargo = this.formUsuario!.get('usuario_cargo')!.value;
    user.usuario_celular = this.formUsuario!.get('usuario_celular')!.value;
    delete user.usuario_acesso2;
    delete user.local_nome;
    // @ts-ignore
    delete user.usuario_id;
    // delete user.usuario_senha;
    return user;
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formUsuario?.get(campo)?.valid &&
      (this.formUsuario?.get(campo)?.touched || this.formUsuario?.get(campo)?.dirty)
    );
  }

  verificaValidacoesForm() {
    let a = 0;
    Object.keys(this.formUsuario!.controls).forEach(campo => {
      const controle = this.formUsuario?.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormControl) {
        if (controle.invalid) {
          a++;
        }
      }
    });
    if (a > 0) {
      this.messageService.add({
        key: 'usuarioToast',
        severity: 'warn',
        summary: 'ATENÇÃO - ERRO',
        detail: 'DADOS INVÁLIDOS'
      });
    } else {
      // this.enviarEmenda();
    }
  }

  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }


  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
