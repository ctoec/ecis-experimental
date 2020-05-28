export type ApiExtraParamOpts = {
	start: number;
	count: number;
};

export const appendData = <TData>(data: TData, newData: TData) => {
	return ([
		...(((data || []) as unknown) as any[]),
		...((newData as unknown) as any[]),
	] as unknown) as TData;
};

export const paginate = <T>(requestParams: T, opts?: ApiExtraParamOpts) => {
	if (!opts) {
		return requestParams;
	} else {
		const processedOpts = {
			skip: opts.start,
			take: opts.count,
		};
		return { ...requestParams, ...processedOpts };
	}
};
