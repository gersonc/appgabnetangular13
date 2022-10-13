// noinspection CssInvalidPropertyValue

import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../_services';
import { EtiquetaInterface, EtiquetaCelula } from '../_models';
import {CadastroEtiquetaI} from "../../cadastro/_models/cadastro-etiqueta-i";
import {EtiquetaCadastroService} from "./etiqueta-cadastro.service";


@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {
  private etiqueta$: Observable<EtiquetaInterface>;
  private url: string;
  pw: any = null; // global variable
  previousURL = null;
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
  // cadastro: CadastroEtiquetaI[];
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
    private http: HttpClient,
    public ecs: EtiquetaCadastroService
  ) { }

  public getConfigEtiqueta(etq_id: number): Observable<EtiquetaInterface> {
    this.url = this.urlService.etiqueta;
    const url = this.url + '/getid/' + etq_id;
    this.etiqueta$ = this.http.get<EtiquetaInterface>(url);
    return this.etiqueta$;
  }

  public imprimirEtiqueta(etq_id: number) {
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
    for (let cad of this.ecs.cadastro) {
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
    if (this.pw !== null) {
      this.pw.close();
      this.pw = null;
      this.printSelectedArea();
    } else {
      this.pw = window.open('',
        '_blank',
        'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
      );
      this.pw.document.open();
      this.pw.document.write(this.ht);
      this.pw.document.addEventListener("DOMContentLoaded", (event) => {
        console.log("DOM fully loaded and parsed");
        this.criaLinha();
      });




      this.pw.onDOMContentLoaded = (event) => {
        if (this.pw.document.readyState === 'loading') {  // Loading hasn't finished yet
          console.log("DOM fully loaded and parsed.....");
        } else {  // `DOMContentLoaded` has already fired
          this.criaLinha();
        }
      };

      this.pw.document.close();
    }



    // popupWinindow.print();
    // popupWinindow.close();
  }

  printSelectedArea2() {
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
  border: 0.1px solid #000000;
}

td {
  border: 0.1px solid #000000;
}
</style>
</head>
<body>
	<div class=Section1>
		<table id="table0" border="0" cellspacing="0" cellpadding="0" style='border-collapse:collapse;'>
		<tbody id="tbd">
			<tr id="row000" style='height:${this.etq_altura}mm;'>
				<td id='col0' style='font-size: 8.0pt; width:${this.etq_largura}mm; padding:0 .75pt 0 .75pt;height:${this.etq_altura}mm'>
				</td>
				<td id='col1' style='width:${this.etq_distancia_horizontal}mm; padding:0 .75pt 0 .75pt;height:${this.etq_altura}mm'>
					<p style='margin-top:0mm; margin-right:4.75pt; margin-bottom:0cm; margin-left:4.75pt; margin-bottom:.0001pt'>
						<span style='font-size:8.0pt'>&nbsp;</span>
					</p>
				</td>
        `;

      if (this.etq_colunas === 3) {
          this.ht += `
        <td id='col3' style='font-size: 8.0pt;width:${this.etq_largura}mm; padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>
        </td>
        <td id='col4' style='width:${this.etq_distancia_horizontal}mm;padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>
            <p style='margin-top:0mm;margin-right:4.75pt;margin-bottom:0cm;margin-left:4.75pt;margin-bottom:.0001pt'>
                <span style='font-size:8.0pt'>
                    &nbsp;
                </span>
            </p>
        </td>
        `;
        }
        this.ht += `
        <td id='col2' style='font-size: 8.0pt;width:${this.etq_largura}mm; padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>
        </td>
		</tr>
		</tbody>
		</table>
	</div>
</body>
</html>
`;
  }

  paginaHtml2 () {
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
    const b = this.ecs.cadastro.length - 1;
    while (this.ecs.cadastro.length > 0) {
      if (a === 0) {
        this.ht += `
	<div class=Section1>
		<table border="0" cellspacing="0" cellpadding="0" style='border-collapse:collapse'>
`;
      }
      if (this.ecs.cadastro.length === 0) {
        this.ht += `<td></td>`;
      } else {
        a++;
        cad = this.ecs.cadastro.shift ();
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
        if (this.ecs.cadastro.length === 0) {
          this.ht += `<td></td>`;
        } else {
          a++;
          cad = this.ecs.cadastro.shift ();
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
      if (this.ecs.cadastro.length === 0) {
        this.ht += `<td></td>`;
      } else {
        a++;
        cad = this.ecs.cadastro.shift ();
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
      if (a >= this.etq_num || this.ecs.cadastro.length === 0) {
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
    // this.criaCorpo ();
    this.paginaHtml();
    this.printSelectedArea ();
    return true;
  }

  imprimeEtq2() {
    this.etq_num = this.etq_linhas * this.etq_colunas;
    this.pag = this.pagina ();
    this.cel = this.celula ();
    this.esph = this.espHorz ();
    this.espv = this.espVert ();
    this.texto = this.cssTexto ();
    // this.criaCorpo ();
    this.paginaHtml();
    this.printSelectedArea ();
    return true;
  }

  criaLinha() {
    console.log('aaaaaaaaaa');
    const tabela = this.pw.document.getElementById('table0');
    const tbdy = this.pw.document.getElementById('tbd');
    const r0 = this.pw.document.getElementById('row000');
    let col3: any;
    let col4: any;
    let row0 = r0.cloneNode();
    row0.removeAttribute('id');
    for (const ch of r0.children) {
      console.log(ch.tagName);
    }

    const c0 = this.pw.document.getElementById('col0');
    let col0 = c0.cloneNode();
    col0.removeAttribute('id');
    const c1 = this.pw.document.getElementById('col1');
    let col1 = c1.cloneNode();
    col1.removeAttribute('id');
    const c2 = this.pw.document.getElementById('col2');
    let col2 = c2.cloneNode();
    col2.removeAttribute('id');
    if (this.etq_colunas === 3) {
      const c3 = this.pw.document.getElementById('col3');
      let col3 = c3.cloneNode();
      col3.removeAttribute('id');
      const c4 = this.pw.document.getElementById('col4');
      let col4 = c4.cloneNode();
      col4.removeAttribute('id');
    }


    let newText1 = this.pw.document.createTextNode('jhgjhgjhghj');


    let a = 0;
    let cad: CadastroEtiquetaI;
    const b = this.ecs.cadastro.length - 1;
    while (this.ecs.cadastro.length > 0) {

      let rr0 = row0;
      let cc0 = col0;
      let cc1 = col1;
      let cc2 = col2;
      let cc3 = null;
      let cc4 = null;
      if (col3 !== undefined && col4 !== undefined && this.etq_colunas === 3) {
        cc3 = col3;
        cc4 = col4;
      }


      a++;
      cad = this.ecs.cadastro.shift();
      let et0 = this.pw.document.createTextNode(EtiquetaCelula.montaCelula(cad));

      cc0.append(et0);
      rr0.append(cc0);
      rr0.append(cc1);
      if (this.etq_colunas === 3) {
        if (col3 !== undefined && col4 !== undefined && this.ecs.cadastro.length > 0) {
          a++;
          cad = this.ecs.cadastro.shift();
          let et2 = this.pw.document.createTextNode(EtiquetaCelula.montaCelula(cad));
          cc3.append(et2);
        }
        rr0.append(cc3);
        rr0.append(cc4);
      }

      if (this.ecs.cadastro.length > 0) {
        a++;
        cad = this.ecs.cadastro.shift();
        let et3 = this.pw.document.createTextNode(EtiquetaCelula.montaCelula(cad));
        cc2.append(et3);
      }
      rr0.append(cc2);
      tbdy.append(rr0);

    }

    /*col0.append(newText2);
    row0.append(col0);
    row0.append(col1);
    row0.append(col2);
    tbdy.append(row0);*/



      for (const ch1 of row0.children) {
        console.log('gggggg',ch1.tagName);
      }



      /*for (const node of child) {
        // Do something with each child as children[i]
        // NOTE: List is live! Adding or removing children will change the list's `length`
        console.log(node);
      }*/

  }

  public montaCelula2(cadastro: CadastroEtiquetaI, h: HTMLElement) {
    let newText1 = this.pw.document.createTextNode('jhgjhgjhghj');
    let str = '';
    // ************ Pessoa Fisica
    if (cadastro.cadastro_tipo_tipo === 1) {
      str += cadastro.cadastro_tratamento_nome + '<br>';
      str += cadastro.cadastro_nome + '<br>';
      str += cadastro.cadastro_endereco;
      if (cadastro.cadastro_endereco_numero !== null) {
        str += ',' + cadastro.cadastro_endereco_numero;
      }
      if (cadastro.cadastro_endereco_complemento !== null) {
        str += ' ' + cadastro.cadastro_endereco_complemento;
      }
      str += '<br>';

      let nc = 0;
      if (cadastro.cadastro_bairro !== null) {
        nc += cadastro.cadastro_bairro.length;
      }
      if (nc > 0) {
        nc += cadastro.cadastro_municipio_nome.length + 2;
        if (nc <= 31) {
          str += cadastro.cadastro_bairro + '  ';
          str += cadastro.cadastro_municipio_nome + '  ';
          str += cadastro.cadastro_estado_nome + '<br>';
          str += cadastro.cadastro_cep;
        } else {
          str += cadastro.cadastro_bairro + '<br>';
          str += cadastro.cadastro_cep + '  ';
          str += cadastro.cadastro_municipio_nome + ' ';
          str += cadastro.cadastro_estado_nome;
        }
      } else {
        str += cadastro.cadastro_municipio_nome + '  ';
        str += cadastro.cadastro_estado_nome + '<br>' + cadastro.cadastro_cep;
      }
    }
    // **************** Pessoa Juridica
    if (cadastro.cadastro_tipo_tipo === 2) {

      if (cadastro.cadastro_responsavel !== null) {
        if (cadastro.cadastro_tratamento_nome !== null) {
          str += cadastro.cadastro_tratamento_nome + '<br>';
          str += cadastro.cadastro_responsavel + '<br>';
        }
      }
      if (cadastro.cadastro_nome !== null) {
        str += cadastro.cadastro_nome + '<br>';
      }
      if (cadastro.cadastro_cargo !== null) {
        if (cadastro.cadastro_cargo !== 'PESSOA JURÍDICA') {
          str += cadastro.cadastro_cargo + '<br>';
        }
      }
      str += cadastro.cadastro_endereco;
      if (cadastro.cadastro_endereco_numero !== null) {
        str += ',' + cadastro.cadastro_endereco_numero;
      }
      if (cadastro.cadastro_endereco_complemento !== null) {
        str += ' ' + cadastro.cadastro_endereco_complemento;
      }
      str += '<br>';
      let nc = 0;
      if (cadastro.cadastro_bairro !== null) {
        nc += cadastro.cadastro_bairro.length;
      }
      if (nc > 0) {
        nc += cadastro.cadastro_municipio_nome.length + 2;
        if (nc <= 31) {
          str += cadastro.cadastro_bairro + '  ';
          str += cadastro.cadastro_municipio_nome + '  ';
          str += cadastro.cadastro_estado_nome + '<br>';
          str += cadastro.cadastro_cep;
        } else {
          str += cadastro.cadastro_bairro + '<br>';
          str += cadastro.cadastro_cep + '  ';
          str += cadastro.cadastro_municipio_nome + ' ';
          str += cadastro.cadastro_estado_nome;
        }
      } else {
        str += cadastro.cadastro_municipio_nome + '  ';
        str += cadastro.cadastro_estado_nome + '<br>' + cadastro.cadastro_cep;
      }
    }
    return str;
  }
}
