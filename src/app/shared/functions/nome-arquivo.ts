export function nomeArquivo(tipo: string, modulo: string = ''): string {
  modulo = (modulo !== '') ? modulo + '_' : '';
  let d = new Date();
  let h = '';
  h += (d.getDate() > 9) ? d.getDate().toString() : '0' + d.getDate().toString();
  h += (d.getMonth() > 9) ? d.getMonth().toString() : '0' + d.getMonth().toString();
  h += d.getFullYear().toString();
  h += (d.getHours() > 9) ? d.getHours().toString() : '0' + d.getHours().toString();
  h += (d.getMinutes() > 9) ? d.getMinutes().toString() : '0' + d.getMinutes().toString();
  h += (d.getSeconds() > 9) ? d.getSeconds().toString() : '0' + d.getSeconds().toString();
  return 'Gabnet_' + '_' + modulo + '_'  + h +'.' + tipo;
}
