export default function currencyFormatter(number?: number | null) {
  if (!number) {
    return '';
  }

  return '$' + number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
