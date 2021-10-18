import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  // encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  // submitted = false;
  returnUrl: string;
  error = '';
  sub: Subscription[] = [];
  mostraForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.min(7), Validators.max(50)]],
      password: ['', [Validators.required, Validators.min(7), Validators.max(50)]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  // get f() { return this.loginForm.controls; }

  onSubmit() {
    // this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.valid) {

      this.loading = true;
      this.sub.push(this.authenticationService.login(
        this.loginForm.controls.username.value,
        this.loginForm.controls.password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.error = error;
            console.log('error->', this.error);
            this.loading = false;
          }));
    } else {
      console.log('Formulario invalido');
      this.verificaValidacoesForm(this.loginForm);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      /*
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
      */
    });
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
