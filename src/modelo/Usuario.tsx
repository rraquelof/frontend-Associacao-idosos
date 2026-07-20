export default interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tipo: string;
  sexo: string;
  endereco: string;
  telefone: string;
  // Preenchido apenas para usuários do tipo "familiar": id do idoso ao qual
  // esse usuário está vinculado (restringe o acesso a esse idoso).
  idosoVinculado?: string;
}
