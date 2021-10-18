import {MunicipioInterface} from './municipio.interface';

export class Municipio implements MunicipioInterface {
  public municipio_id: number = null;
  public municipio_nome: string = null;
  public municipio_limpo: string = null;
}
