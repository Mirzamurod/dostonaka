export const getSum = (price: number | string) =>
  Number(price).toLocaleString().replaceAll(',', ' ') + " so'm"
