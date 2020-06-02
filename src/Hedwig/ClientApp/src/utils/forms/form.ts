// Much of this file is influenced by https://levelup.gitconnected.com/handling-complex-form-state-using-react-hooks-76ee7bc937

import produce from 'immer';
import { set } from 'lodash';
import { HTMLChoiceElement } from '../../components';
import { Dispatch } from 'react';

/**
 * Helper type for including name field on non-native select/input
 * e.g. DatePicker
 */
export type InputField<T> = T & {
	name: string;
};

/**
 * Reducer for form data
 */
export type FormReducer<S> = (state: S, action: FormReducerUpdate<S>) => S;
/**
 * Update type for a form reducer
 * Accepts either to rewrite the whole state, partial update, function, or specific nested path update
 */
export type FormReducerUpdate<S> = S | Partial<S> | ((_: S) => S) | FormReducerObjectPathUpdate<S>;

/**
 * Helper type for specifying path update
 */
type FormReducerObjectPathUpdate<S> = {
	_path: string | number | symbol | string[];
	_value: Partial<S> | S;
};

/**
 * Helper type constraint for FormReducerObjectPathUpdate
 * @param obj
 */
function isFormReducerObjectPathUpdate<S>(obj: any): obj is FormReducerObjectPathUpdate<S> {
	if (!obj) return false;
	const _obj = obj as FormReducerObjectPathUpdate<S>;
	return _obj._path !== undefined && _obj._value !== undefined;
}

/**
 * Helper type constraint for React.ChangeEvent<T>
 * @param obj
 */
function isChangeEvent<T extends HTMLChoiceElement | HTMLTextAreaElement>(
	obj: any
): obj is React.ChangeEvent<T> {
	const _obj = obj as React.ChangeEvent<T>;
	return _obj.target && _obj.target.name ? true : false;
}

/**
 * Reducer that is passed into useReducer to update complex form data state
 * @param state Current state
 * @param updateArg Update mechanism
 */
export function formReducer<S extends object | null>(_state: S, updateArg: FormReducerUpdate<S>) {
	if (!_state) {
		return {} as S;
	}
	const state = _state as NonNullable<S>;
	if (updateArg instanceof Function) {
		// if the type of update argument is a callback function, apply it to the current state
		return { ...state, ...updateArg(state) };
	} else {
		// if the type of update argument is an object
		if (isFormReducerObjectPathUpdate<S>(updateArg)) {
			// if the update object is of type FormReducerObjectPathUpdate
			const { _path, _value } = updateArg;

			// immutably apply changes
			return produce(state, (draft) => {
				set(draft, _path, _value);
			});
		} else {
			return { ...state, ...updateArg };
		}
	}
}

/**
 * Wrapper function for applying the updates to form data based on a data transform
 * @param update update function returned from useReducer
 */
export const updateData =
	// update supplied by result of useReducer
	<S extends {} | null>(update: Dispatch<FormReducerUpdate<S>>) =>
		// processData function convert string to appropriate data type
		// TODO: REWORK TYPINGS HERE
		(processData?: (valOrEvent: any, eventIfChangeEvent?: any) => any) =>
			// conditional fork for varying data input methods (select/input vs custom like DatePicker)
			<T extends {}>(
				event: React.ChangeEvent<HTMLChoiceElement | HTMLTextAreaElement> | InputField<T>
			) => {
				if (isChangeEvent(event)) {
					const {
						target: { name, value },
					} = event;
					update({
						_path: name,
						_value: processData ? processData(value, event) : value,
					});
				} else {
					const { name } = event;
					update({
						_path: name,
						_value: processData ? processData(event) : event,
					});
				}
			};

/**
 * Utility for processing ChoiceList selects
 * @param val value to convert to a ChoiceList supported select array of strings
 */
export function toFormString(val: any): string[] | undefined {
	if (val === undefined || val === null) {
		return undefined;
	}
	if (typeof val === 'string') {
		return [val];
	}
	if (typeof val === 'number') {
		return ['' + val];
	}
	return [];
}
