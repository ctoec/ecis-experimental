import produce from "immer";
import { set } from "lodash";
import { HTMLChoiceElement } from "../../components";
import { Dispatch } from "react";

export type InputField<T> = T & {
	name: string
};

export type FormReducer<S> = (state: S, action: FormReducerUpdate<S>) => S;
export type FormReducerUpdate<S> = S | Partial<S> | ((_: S) => S) | FormReducerObjectPathUpdate<S>;

type FormReducerObjectPathUpdate<S> = {
	_path: string | number | symbol | string[],
	_value: Partial<S> | S
};

function isFormReducerObjectPathUpdate<S>(obj: any): obj is FormReducerObjectPathUpdate<S> {
	const _obj = obj as FormReducerObjectPathUpdate<S>;
	return _obj._path !== undefined && _obj._value !== undefined;
}

function isChangeEvent<T extends HTMLChoiceElement>(obj: any): obj is React.ChangeEvent<T> {
	const _obj = obj as React.ChangeEvent<T>;
	return _obj.target && _obj.target.name && _obj.target.value ? true : false;
}

export function formReducer<S extends object>(state: S, updateArg: FormReducerUpdate<S>) {
	// check if the type of update argument is a callback function
	if (updateArg instanceof Function) {
		return { ...state, ...updateArg(state) };
	} else {
		// if the type of update argument is an object
		if (isFormReducerObjectPathUpdate<S>(updateArg)) {
			// does the update object have _path and _value as it's keys
			// if yes then use them to update deep object values
			// const _path = uDraftpdateArg._path;
			const { _path, _value } = updateArg;

			return produce(state, draft => {
				set(draft, _path, _value);
			});
		} else {
			return { ...state, ...updateArg };
		}
	}
}

export const updateData = 
	<S extends {}>(update: Dispatch<FormReducerUpdate<S>>) =>
		(processData: (_: any) => any) =>
			<T extends {}>(event: React.ChangeEvent<HTMLChoiceElement> | InputField<T>) => {
				if (isChangeEvent(event)) {
					const { target: { name, value } } = event;
					update({
						_path: name,
						_value: processData(value)
					});
				} else {
					const { name } = event;
					update({
						_path: name,
						_value: processData(event)
					});
				}
			}
		
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
