import { useState } from "react";
import axios from "axios";

export default function UploadFoto() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivo(file);
    setPreview(URL.createObjectURL(file)); 
  }

  async function handleUpload() {
    if (!arquivo) return alert("Selecione uma imagem!");

    const formData = new FormData();
    formData.append("foto", arquivo);

    try {
      const response = await axios.post(
        "https://api-associacao-idosos.onrender.com/uploads",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Arquivo salvo como:", response.data.arquivo);
      alert("Upload concluído!");
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha no upload.");
    }
  }

  return (
    <div className="flex flex-col gap-4 w-fit">

      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-fit">
        Selecionar Foto
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {preview && (
        <img
          src={preview}
          alt="Prévia"
          className="w-36 rounded-lg shadow-md"
        />
      )}
    </div>
  );
}
