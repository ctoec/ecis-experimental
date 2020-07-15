import { TObjectDriller } from './ObjectDriller';
import { FormStatusProps } from '@ctoec/component-library';

export type FormStatusFunc<TData> = (
	_: TObjectDriller<NonNullable<TData>>
) => FormStatusProps | undefined;
