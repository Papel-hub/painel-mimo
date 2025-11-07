import { Compra } from"@/types/compra";
import  {Pagamento}  from"@/types/pagamento";

export interface Cliente {
  nome: string;
  email?: string;
  celular?: string;
  cpf?: string;
  createdAt?: string;
  status?: string;
  tipoPessoa?: string;
  compras?: Compra[];
  pagamento?: Pagamento;
}

