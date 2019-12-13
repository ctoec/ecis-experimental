import notNullOrUndefined from './notNullOrUndefined';

export default function currencyFormatter(number?: number | null) {
  if (!notNullOrUndefined(number)) {
    return '';
  }

  return '$' + number!.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
