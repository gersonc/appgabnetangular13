export class ContaArray {
  public static getArrayTitulo() {
    const contaArrayTitulos: any[] = [];
    contaArrayTitulos['conta_cedente'] = 'CEDENTE';
    contaArrayTitulos['conta_valor'] = 'VALOR';
    contaArrayTitulos['conta_vencimento'] = 'DT. VENC.';
    contaArrayTitulos['conta_observacao'] = 'OBSERVAÇÃO';
    contaArrayTitulos['conta_id'] = 'ID';
    contaArrayTitulos['conta_debito_automatico_id'] = 'DBTO. AUT.';
    contaArrayTitulos['conta_debito_automatico'] = 'DBTO. AUT.';
    contaArrayTitulos['conta_local_id'] = 'NÚCLEO';
    contaArrayTitulos['conta_local_nome'] = 'NÚCLEO';
    contaArrayTitulos['conta_tipo_id'] = 'TIPO';
    contaArrayTitulos['conta_tipo'] = 'TIPO';
    contaArrayTitulos['conta_paga_id'] = 'PAGO';
    contaArrayTitulos['conta_paga'] = 'PAGO';
    contaArrayTitulos['conta_pagamento'] = 'DT. PGTO.';
    return contaArrayTitulos;
  }
}
