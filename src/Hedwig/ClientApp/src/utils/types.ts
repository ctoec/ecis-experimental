// DeepNonUndefineable type inspired by Facebook's idx
// https://github.com/facebookincubator/idx/blob/master/packages/idx/src/idx.d.ts

// Added from https://stackoverflow.com/questions/57100616/how-to-forward-well-known-symbols-in-a-type-wrapper-mapped-type/57101132
// Needed to support objects like Date
// Conditionally adds symbol support to objects
type AddSymbolToPrimitive<T> = T extends
	{ [Symbol.toPrimitive]: infer V; }
	? { [Symbol.toPrimitive]: V; }
	: {};
// End

// Helper type to remove the ability of type T to be undefined
type NonUndefineable<T> = Exclude<T, undefined>;

// Helper type to descend into an object and apply NonUndefineable to all keys, recursively
// And copy over symbols which typescript does not suppoort with `keyof`
type DeepNonUndefineableObject<T extends object> = 
	{
		// Mapped type where every key becomes required : Recursively apply DeepNonUndefineable 
		[P in keyof T]-?: DeepNonUndefineable<T[P]>
	}
	// Add type for symbols
	& AddSymbolToPrimitive<T>

// Helper interface for handling arrays
// Interface is required because defined types cannot use extend
interface DeepNonUndefineableArray<T> extends Array<DeepNonUndefineable<T>> {};

// Helper type to make the return type of a funtion required
type FunctionWithRequiredReturnType<
	// Require T to extend a function type for semantic clarity (not required for proper type inference)
  T extends (...args: any[]) => any> =
	// If T extends function type, infer the arguments and return types
	T extends (...args: infer A) => infer R
	// Make the return type not undefined
  ? (...args: A) => DeepNonUndefineable<R>
	: never;

// Export the conditional application of the appropriate helper type
// Array or Function must be first and second (any order)
// then Object
// Because the first two are subsets of object
export type DeepNonUndefineable<T> = 
	T extends any[] ? DeepNonUndefineableArray<T[number]> :
	T extends (...args: any[]) => any ? FunctionWithRequiredReturnType<T> :
	T extends object ? DeepNonUndefineableObject<T> : NonUndefineable<T>;
