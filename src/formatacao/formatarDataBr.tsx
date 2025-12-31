export const formatarDataBR = (dateValue: string | Date | null | undefined): string => {
  if (!dateValue) return "";

  const data = new Date(dateValue);

  if (isNaN(data.getTime())) return "";

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
};
