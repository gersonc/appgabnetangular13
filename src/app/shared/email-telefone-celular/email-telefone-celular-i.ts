export interface EmailTelefoneCelularI {
  ativo: boolean;
  tipo: number; // 0 - null, 1 - WhatsApp, 2 - telefone, 3 - email, 4 - sem modificacao
  valor?: string | null;
  whats?: string;
  tel?: string;
  email?: string;
}

export const CAMPOSCOMUNICACAO: string[] = [
  'cadastro_celular',
  'cadastro_celular2',
  'cadastro_telefone',
  'cadastro_telefone2',
  'cadastro_telcom',
  'cadastro_fax',
  'cadastro_email',
  'cadastro_email2'
];

export function telefone_validation(telefone: string, field: string|null = null): boolean {
  //retira todos os caracteres menos os numeros
  telefone = telefone.replace(/\D/g, '');

  //verifica se tem a qtde de numero correto
  if (!(telefone.length >= 10 && telefone.length <= 11)) return false;

  //Se tiver 11 caracteres, verificar se começa com 9 o celular
  if (telefone.length === 11 && parseInt(telefone.substring(2, 3)) !== 9) return false;

  //verifica se não é nenhum numero digitado errado (propositalmente)
  for (let n = 0; n < 10; n++) {
    //um for de 0 a 9.
    //estou utilizando o metodo Array(q+1).join(n) onde "q" é a quantidade e n é o
    //caractere a ser repetido
    if (telefone === new Array(11).join(n.toString()) || telefone === new Array(12).join(n.toString())) return false;
  }
  //DDDs validos
  const codigosDDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
    21, 22, 24, 27, 28, 31, 32, 33, 34,
    35, 37, 38, 41, 42, 43, 44, 45, 46,
    47, 48, 49, 51, 53, 54, 55, 61, 62,
    64, 63, 65, 66, 67, 68, 69, 71, 73,
    74, 75, 77, 79, 81, 82, 83, 84, 85,
    86, 87, 88, 89, 91, 92, 93, 94, 95,
    96, 97, 98, 99];
  //verifica se o DDD é valido (sim, da pra verificar rsrsrs)
  if (codigosDDD.indexOf(parseInt(telefone.substring(0, 2))) == -1) return false;

  //  E por ultimo verificar se o numero é realmente válido. Até 2016 um celular pode
  //ter 8 caracteres, após isso somente numeros de telefone e radios (ex. Nextel)
  //vão poder ter numeros de 8 digitos (fora o DDD), então esta função ficará inativa
  //até o fim de 2016, e se a ANATEL realmente cumprir o combinado, os numeros serão
  //validados corretamente após esse período.
  //NÃO ADICIONEI A VALIDAÇÂO DE QUAIS ESTADOS TEM NONO DIGITO, PQ DEPOIS DE 2016 ISSO NÃO FARÁ DIFERENÇA
  //Não se preocupe, o código irá ativar e desativar esta opção automaticamente.
  //Caso queira, em 2017, é só tirar o if.
  // if (new Date().getFullYear() < 2017) return true;
  if (telefone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(telefone.substring(2, 3))) == -1) return false;

  //se passar por todas as validações acima, então está tudo certo
  return true;


//chamada simples
//telefone_validation("(11)99000-3777"); // retorna true
//telefone_validation("11-99000-3777"); // retorna true
//telefone_validation("11990003777"); // retorna true
//telefone_validation("1111111111"); // retorna false
//telefone_validation("1111111111"); // retorna false
//telefone_validation("(01)3444-4444"); // retorna false
//telefone_validation("(01)43444-4444"); // retorna false


  /*
    https://pt.wikipedia.org/wiki/N%C3%BAmeros_de_telefone_no_Brasil
    http://www.anatel.gov.br/Portal/exibirPortalPaginaEspecial.do?org.apache.struts.taglib.html.TOKEN=9594e1d11fbc996d52bda44e608bb744&codItemCanal=1794&pastaSelecionada=2984
    https://github.com/gammasoft/brasil/blob/c0d04de0afc5843e4dcc64223a3b26d56a7192b7/lib/dadosUtils.js#L57-L94
  */

}

export function getTelWhatsApp(field: string, valor: string): EmailTelefoneCelularI {
  let vl: string = valor.trim();
  vl = vl.replace(/\D/g, '');
  vl = vl.replace(' ', '');
  vl = vl.replace('(', '');
  vl = vl.replace(')', '');
  vl = vl.replace('-', '');
  vl = vl.replace('.', '');
  vl = vl.replace('+', '');
  if (vl.substr(0, 1) === '0') {
    vl = vl.substr(1);
  }

  const l = vl.length;

  if (l < 8 || l > 11) {
    return {
      ativo: false,
      tipo: 0,
      valor: valor
    }
  }

  if (l === 8) {
    if (telefone_validation('11'.concat(vl), field)) {
      return {
        ativo: true,
        tipo: 2,
        valor: valor,
        tel: vl
      }
    } else {
      return {
        ativo: false,
        tipo: 0,
        valor: valor
      }
    }
  }

  if (l === 9) {
    if (vl.substr(0, 1) === '9') {
      if (telefone_validation('11'.concat(vl), field)) {
        return {
          ativo: true,
          tipo: 2,
          valor: valor,
          tel: vl
        }
      } else {
        return {
          ativo: false,
          tipo: 0,
          valor: valor
        }
      }
    } else {
      return {
        ativo: false,
        tipo: 0,
        valor: valor
      }
    }
  }

  if (l === 10) {
    if (telefone_validation(vl, field)) {
      return {
        ativo: true,
        tipo: 2,
        valor: valor,
        tel: '0'.concat(vl)
      }
    } else {
      return {
        ativo: false,
        tipo: 0,
        valor: valor
      }
    }
  }

  if (l === 11) {
    if (telefone_validation(vl, field)) {
      console.log('telefone_validation', telefone_validation(vl, field), vl, field);
      return {
        ativo: true,
        tipo: 1,
        valor: valor,
        tel: '0'.concat(vl),
        whats: '55'.concat(vl)
      }
    } else {
      return {
        ativo: false,
        tipo: 0,
        valor: valor
      }
    }
  }
}

export function getCEmail(field: string, valor: string): EmailTelefoneCelularI {
  const vl = valor.toLowerCase();
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

  if (emailRegex.test(vl)) {
    return {
      ativo: true,
      tipo: 3,
      valor: valor,
      email: vl
    }
  } else {
    return {
      ativo: false,
      tipo: 0,
      valor: valor
    }
  }
}

export function getComunicacao(field: string, valor?: any): EmailTelefoneCelularI {
  if (valor === undefined) {
    return {
      ativo: false,
      tipo: 0,
      valor: null
    }
  }

  if (valor === null) {
    return {
      ativo: false,
      tipo: 0,
      valor: null
    }
  }

  if (valor.toString().length < 8) {
    return {
      ativo: false,
      tipo: 0,
      valor: null
    }
  }

  if (CAMPOSCOMUNICACAO.indexOf(field) === -1) {
    return {
      ativo: false,
      tipo: 0,
      valor: valor
    }
  }

  valor = valor.toString();

  if (field === 'cadastro_email' || field === 'cadastro_email2') {
    return getCEmail(field, valor);
  }

  return getTelWhatsApp(field, valor);

}
