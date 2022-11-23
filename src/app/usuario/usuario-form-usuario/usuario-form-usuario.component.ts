import {Component, OnDestroy, OnInit} from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient} from "@angular/common/http";
import {UsuarioFormI} from "../_models/usuario-form-i";
import {UsuarioInterface} from "../_models/usuario";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-usuario-form-usuario',
  templateUrl: './usuario-form-usuario.component.html',
  styleUrls: ['./usuario-form-usuario.component.css']
})
export class UsuarioFormUsuarioComponent implements OnInit, OnDestroy {
  formU: FormGroup;
  sub: Subscription[] = [];
  usuario: UsuarioFormI = null;
  mostraForm = false;
  botaoEnviarVF = false;

  constructor(
    private url: UrlService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getUsuario();
  }

  getUsuario() {
    this.sub.push(this.getUsuarioId()
      .pipe(take(1))
      .subscribe((dados) => { this.usuario = dados;})
    );
  }

  getUsuarioId() {
    const u: any = localStorage.getItem('currentUser');
    const url = this.url.usuario + '/usuario/' + u.usuario_id;
    return this.http.get<UsuarioFormI>(url);
  }

  criaForm() {
    this.formU = this.formBuilder.group({
      usuario_nome: [this.usuario.usuario_nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      usuario_login: [this.usuario.usuario_login, [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
      usuario_senha: [this.usuario.usuario_senha, [Validators.required, Validators.pattern('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{7,})')]],
      usuario_email: [this.usuario.usuario_email, [Validators.required, Validators.email]],
      usuario_cargo: [this.usuario.usuario_cargo, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      usuario_celular: [this.usuario.usuario_celular, [Validators.required, Validators.pattern('^([14689][0-9]|2[12478]|3([1-5]|[7-8])|5([13-5])|7[193-7])9[0-9]{8}$')]],
    });
  }





  resetForm() {
    this.criaForm();
  }

  voltarListar() {

  }

  onSubmit() {

  }


  verificaValidTouched(campo: string) {
    return (
      !this.formU.get(campo).valid &&
      (this.formU.get(campo).touched || this.formU.get(campo).dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  validaAsync(campo: string, situacao: boolean) {
    return (
      ((!this.formU.get(campo).valid || situacao) && (this.formU.get(campo).touched || this.formU.get(campo).dirty))
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'ng-invalid': this.validaAsync(campo, situacao),
      'ng-dirty': this.validaAsync(campo,situacao)
    };
  }


  ngOnDestroy() {
    this.sub.forEach(s => s.unsubscribe());
  }

}
