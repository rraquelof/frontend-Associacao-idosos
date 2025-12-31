export function formatarData(dateValue: string | Date | null | undefined): string {
  if (!dateValue) return "";

  const data =
    dateValue instanceof Date
      ? dateValue
      : new Date(dateValue); 

  if (isNaN(data.getTime())) return ""; 

  return data.toISOString().split("T")[0];
}
