import notNullOrUndefined from './notNullOrUndefined';

export default function currencyFormatter(number?: number | null, excludeDollarSign?: true) {
	if (!notNullOrUndefined(number)) {
		return '';
	}

	return (!excludeDollarSign ? '$' : '') + number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
