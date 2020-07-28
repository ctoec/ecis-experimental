import { TObjectDriller } from './ObjectDriller';
import { FormStatusProps } from '..';

export type FormStatusFunc<TData> = (
	_: TObjectDriller<NonNullable<TData>>
) => FormStatusProps | undefined;
