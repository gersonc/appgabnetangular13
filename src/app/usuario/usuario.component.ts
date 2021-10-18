import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './_services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(
    public us: UsuarioService
  ) { }

  ngOnInit(): void {
    this.us.acao = 'listar';
  }

}
