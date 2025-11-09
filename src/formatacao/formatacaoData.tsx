export const formatacaoData = (dateValue: Date | string | undefined) => {
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split("T")[0];
  }
  return dateValue;
};