import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../_services';
import { EtiquetaInterface, EtiquetaCelula } from '../_models';
import {CadastroEtiquetaI} from "../../cadastro/_models/cadastro-etiqueta-i";


@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {
  private etiqueta$: Observable<EtiquetaInterface>;
  private url: string;
  etq_folha_horz: number;
  etq_folha_vert: number;
  etq_margem_superior: number;
  etq_margem_lateral: number;
  etq_distancia_vertical: number;
  etq_distancia_horizontal: number;
  etq_altura: number;
  etq_largura: number;
  etq_linhas: number;
  etq_colunas: number;
  cadastro: CadastroEtiquetaI[];
  pag: string;
  cel: string;
  esph: string;
  espv: string;
  texto: string;
  ht: any;
  cpo = '';
  etq_num: number;
  public impEtiqueta = new Subject();
  impEtq$ = this.impEtiqueta.asObservable();

  constructor(
    private urlService: UrlService,
    private http: HttpClient
  ) { }

  public getConfigEtiqueta(etq_id: number): Observable<EtiquetaInterface> {
    this.url = this.urlService.etiqueta;
    const url = this.url + '/getid/' + etq_id;
    this.etiqueta$ = this.http.get<EtiquetaInterface>(url);
    return this.etiqueta$;
  }

  public imprimirEtiqueta(etq_id: number, cadastro: CadastroEtiquetaI[]) {
    this.cadastro = cadastro;
    this.getConfigEtiqueta(etq_id).subscribe({
      next: (dados) => {
        this.etq_folha_horz = dados.etq_folha_horz;
        this.etq_folha_vert = dados.etq_folha_vert;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_lateral = dados.etq_margem_lateral;
        this.etq_distancia_vertical = dados.etq_distancia_vertical;
        this.etq_distancia_horizontal = dados.etq_distancia_horizontal;
        this.etq_altura = dados.etq_altura;
        this.etq_largura = dados.etq_largura;
        this.etq_linhas = dados.etq_linhas;
        this.etq_colunas = dados.etq_colunas;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_superior = dados.etq_margem_superior;
      },
      error: err => console.log ('erro', err.toString ()),
      complete: () => {
        this.impEtiqueta.next();
        this.imprimeEtq();
      }
    });
  }

  pagina () {
    const cssPagina = `display:block;`;
    return cssPagina;
  }

  celula () {
    let cssCelula = `width:${this.etq_largura}mm;`;
    cssCelula += `height:${this.etq_altura}mm;`;
    cssCelula += `padding:2mm 3mm 0;`;
    cssCelula += `float: left;text-align:left;overflow: hidden; background-color: red`;
    return cssCelula;
  }

  espHorz () {
    let cssEspHorz = `width:${this.etq_distancia_horizontal - this.etq_largura}mm;`;
    cssEspHorz += `height:${this.etq_altura}mm;`;
    cssEspHorz += `float: left;overflow: hidden; background-color: green;`;
    return cssEspHorz;
  }

  espVert () {
    let cssEspVert = `height:${this.etq_distancia_vertical - this.etq_altura}mm;`;
    cssEspVert += `page-break-after : auto`;
    return cssEspVert;
  }

  cssTexto () {
    const cssTxt = `font-size:8px;text-transform:uppercase;display:block;`;
    return cssTxt;
  }

  criaCorpo () {
    for (const cad of this.cadastro) {
      this.cpo += '<div class=\'cel\'>';
      this.cpo += '<div class=\'texto\'>' + cad.cadastro_tratamento_nome + '</div>';
      this.cpo += '<div class=\'texto\'>' + cad.cadastro_nome + '</div>';
      this.cpo += '<div class=\'texto\'>' + cad.cadastro_endereco + ' ';
      this.cpo += cad.cadastro_endereco_numero + ' ';
      this.cpo += cad.cadastro_endereco_complemento + '</div>';
      this.cpo += '<div class=\'texto\'>' + cad.cadastro_cep + ' ';
      this.cpo += cad.cadastro_municipio_nome + ' ';
      this.cpo += cad.cadastro_estado_nome + '</div>';
      this.cpo += '</div>';
      this.cpo += '<div class=\'cssEspVert\'></div>';
    }
  }

  printSelectedArea () {
    const popupWinindow = window.open ('',
      '_blank',
      'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
    );
    popupWinindow.document.open ();
    popupWinindow.document.write (this.ht);
    popupWinindow.print();
    popupWinindow.close();
  }

  paginaHtml () {
    this.ht = `
<html>
<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<title>ETIQUETAS</title>
<style>
@page
{
	size: ${this.etq_folha_horz}mm ${this.etq_folha_vert}mm;
	margin: ${this.etq_margem_superior}mm ${this.etq_margem_lateral}mm 0mm ${this.etq_margem_lateral}mm;
}
body {
	font-size: 8.0pt;
	font-family:"Verdana, Arial, Helvetica, sans-serif",'sans-serif';
}
div.Section1
{
	page:Section1;
	font-size: 8.0pt;
	font-family:"Verdana, Arial, Helvetica, sans-serif",'sans-serif';
}
table {
  page-break-after:always
  }
</style>
</head>
<body>
`;
    let a = 0;
    let cad: CadastroEtiquetaI;
    const b = this.cadastro.length - 1;
    while (this.cadastro.length > 0) {
      if (a === 0) {
        this.ht += `
	<div class=Section1>
		<table border="0" cellspacing="0" cellpadding="0" style='border-collapse:collapse'>
`;
      }
      if (this.cadastro.length === 0) {
        this.ht += `<td></td>`;
      } else {
        a++;
        cad = this.cadastro.shift ();
        this.ht += `
			<tr style='height:${this.etq_altura}mm;'>
				<td id='${a}_${this.etq_num}'
				style='font-size: 8.0pt;
				width:${this.etq_largura}mm;
				padding:0 .75pt 0 .75pt;height:${this.etq_altura}mm'>`;
        this.ht += EtiquetaCelula.montaCelula (cad);
        this.ht += `
				</td>
				<td style='width:${this.etq_distancia_horizontal}mm;
				padding:0 .75pt 0 .75pt;
				height:${this.etq_altura}mm'>
					<p style='margin-top:0mm;
					margin-right:4.75pt;
					margin-bottom:0cm;
					margin-left:4.75pt;
					margin-bottom:.0001pt'>
						<span style='font-size:8.0pt'>
							&nbsp;
						</span>
					</p>
				</td>
`;
      }
      if (this.etq_colunas === 3) {
        if (this.cadastro.length === 0) {
          this.ht += `<td></td>`;
        } else {
          a++;
          cad = this.cadastro.shift ();
          this.ht += `
            <td id='${a}_${this.etq_num}'
            style='font-size: 8.0pt;width:${this.etq_largura}mm;
            padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>`;
          this.ht += EtiquetaCelula.montaCelula (cad);
          this.ht += `
            </td>
            <td style='width:${this.etq_distancia_horizontal}mm;padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>
                <p style='margin-top:0mm;margin-right:4.75pt;margin-bottom:0cm;margin-left:4.75pt;margin-bottom:.0001pt'>
                    <span style='font-size:8.0pt'>
                        &nbsp;
                    </span>
                </p>
            </td>
            `;
        }
      }
      if (this.cadastro.length === 0) {
        this.ht += `<td></td>`;
      } else {
        a++;
        cad = this.cadastro.shift ();
        this.ht += `
        <td
          id='${a}_${this.etq_num}'
          style='font-size: 8.0pt;width:${this.etq_largura}mm;
          padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'
        >`;
        this.ht += EtiquetaCelula.montaCelula (cad);
        this.ht += `
        </td>
		</tr>
        `;
      }
      if (a >= this.etq_num || this.cadastro.length === 0) {
        a = 0;
        this.ht += `
		</table>
	</div>
    `;
      }
    }
    this.ht += `
</body>
</html>
`;
  }

  imprimeEtq() {
    this.etq_num = this.etq_linhas * this.etq_colunas;
    this.pag = this.pagina ();
    this.cel = this.celula ();
    this.esph = this.espHorz ();
    this.espv = this.espVert ();
    this.texto = this.cssTexto ();
    this.criaCorpo ();
    this.paginaHtml ();
    this.printSelectedArea ();
    return true;
  }
}
