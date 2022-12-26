import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, take} from 'rxjs/operators';

import {AuthenticationService} from '../_services';
import {of, Subscription} from 'rxjs';
import {OnoffLineService} from "../shared/onoff-line/onoff-line.service";
import {AutenticacaoService} from "../_services/autenticacao.service";

function _window(): any {
  // return the global native browser window object
  return window;
}

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  error = '';
  sub: Subscription[] = [];
  mostraForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private as: AutenticacaoService,
    private authenticationService: AuthenticationService,
    public ol: OnoffLineService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(7), Validators.max(50)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  nativeWindow(): any {
    return _window();
  }

  getScreen() {
    const w = this.nativeWindow();
    const m = w.screen;
    const n = w.navigator;

    return  {
      height:m.height,
      width: m.width,
      innerWidth: w.innerWidth,
      innerHeight: w.innerHeight,
      availWidth: m.availWidth,
      availHeight: m.availHeight,
      pixelDepth: m.pixelDepth,
      colorDepth: m.colorDepth,
      appCodeName: n.appCodeName,
      product: n.product,
      appVersion: n.appVersion,
      userAgent: n.userAgent,
      platform: n.platform,
      onLine: n.onLine,
      hostname: w.location.hostname,
    };
  }

  onSubmit() {
    if (this.loginForm.valid) {

      this.loading = true;
      this.sub.push(this.as.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value,this.getScreen())
        .pipe(take(1))
        .subscribe(vf => {
            if (vf) {
              const user: any = JSON.parse(localStorage.getItem('currentUser'));
              this.authenticationService.carregaPermissoes(user);
              this.router.navigate(['/']);

            }
          }
        )
      );
/*



      this.sub.push(this.authenticationService.login(
        this.loginForm.controls.username.value,
        this.loginForm.controls.password.value)
        .pipe(first())
        .subscribe({
          next: vf => {
            console.log(vf);
            if (vf) {
              this.router.navigate(['/']);
            }
          },
          error: error => {
            this.error = error;
            this.loading = false;
          }}));*/
    } else {
      this.verificaValidacoesForm(this.loginForm);
    }
  }

  resetar() {
    this.loginForm.reset();
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
    this.sub.forEach(s => s.unsubscribe());
  }

}
