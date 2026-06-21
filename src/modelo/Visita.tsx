export default interface Visita {
  _id?: string;
  idosoId: {
    _id: string;
    nome: string;
  };
  data: string;
  nome: string;
  createdAt?: string;
  updatedAt?: string;
}
