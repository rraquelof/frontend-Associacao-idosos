export default interface RegistroSaudeIdoso {
  _id: string;
  usuarioId: string; 
  idosoId: {
    _id: string;
    nome: string;
  }; 
  dataConsulta: Date;            
  altura: number;                
  peso: number;                 
  pressao: string;         
  alergias?: string[];            
  glicemia: number;             
  doencasCronicas?: string[];    
  estadoNutricional: "normal" | "baixo peso" | "sobrepeso";
}