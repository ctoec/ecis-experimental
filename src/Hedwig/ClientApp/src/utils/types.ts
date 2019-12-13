// Added from https://stackoverflow.com/questions/57100616/how-to-forward-well-known-symbols-in-a-type-wrapper-mapped-type/57101132
type AddSymbolToPrimitive<T> = T extends
	{ [Symbol.toPrimitive]: infer V; }
	? { [Symbol.toPrimitive]: V; }
	: {};
// End

type NonUndefineable<T> = Exclude<T, undefined>;

type DeepNonUndefineableObject<T extends object> = 
	{
		[P in keyof T]-?: NonUndefineable<DeepNonUndefineable<T[P]>>
	}
	& AddSymbolToPrimitive<T>

interface DeepNonUndefineableArray<T> extends Array<DeepNonUndefineable<T>> {};

type FunctionWithRequiredReturnType<
  T extends (...args: any[]) => any
> = T extends (...args: infer A) => infer R
  ? (...args: A) => DeepNonUndefineable<R>
	: never;

export type DeepNonUndefineable<T> = 
	T extends any[] ? DeepNonUndefineableArray<T[number]> :
	T extends (...args: any[]) => any ? FunctionWithRequiredReturnType<T> :
	T extends object ? DeepNonUndefineableObject<T> : NonUndefineable<T>;
