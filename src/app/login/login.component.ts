import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OnoffLineService} from "../shared/onoff-line/onoff-line.service";
import { AuthService } from "../_services/auth.service";

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  error = '';
 // sub: Subscription[] = [];
  mostraForm = false;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ath: AuthService,
    public ol: OnoffLineService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(7), Validators.max(50)]]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submeter() {
    if (this.loginForm.valid) {
      this.loading = true;
      const u: string = this.loginForm.get('username').value;
      const s: string = this.loginForm.get('password').value;
      this.enviar(u, s);
    } else {
      this.verificaValidacoesForm(this.loginForm);
    }
  }

  enviar(u: string, s:string) {
    this.ath.login(u, s);
  }

  verificaValidTouched(campo: string) {
    return (
      !this.loginForm.get(campo).valid &&
      (this.loginForm.get(campo).touched || this.loginForm.get(campo).dirty)
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

  ngOnDestroy(): void {
  }

}
