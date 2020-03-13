import { ValidationProblemDetails, ProblemDetails, HedwigApi, Configuration, BlobApiResponse, ProblemDetailsFromJSON, ValidationProblemDetailsFromJSON } from "../generated"
import { DeepNonUndefineable } from "../utils/types";
import { useContext, useEffect, useState } from "react";
import AuthenticationContext from "../contexts/Authentication/AuthenticationContext";
import getCurrentHost from "../utils/getCurrentHost";


export type ApiError = ValidationProblemDetails | ProblemDetails;

interface ApiState<TData> {
	skip: boolean;
	loading: boolean;
	error: ApiError | null;
	data: TData | null;
};

export type ApiResult<TData> = [
	boolean, //loading
	ApiError | null, // error
	DeepNonUndefineable<TData> // response
];

interface ApiParamOpts {
	skip?: boolean
};

export default function useNewUseApi<TData>(
	query: (api: HedwigApi) => Promise<TData>,
	opts?: ApiParamOpts
): ApiResult<TData>
{
	// Get accessToken for authenticated API calls
	const { accessToken, withFreshToken } = useContext(AuthenticationContext);
	// And refresh on every render
	useEffect(() => {
		withFreshToken();
	});

	// Set initial api state
	const { skip: _skip } = {
		skip: false,
		...opts
	};
	const [state, setState] = useState<ApiState<TData>>({
		skip: _skip,
		loading: true,
		error: null,
		data: null
	});
	const { skip, loading, error, data } = state;

	// construct API instance
	// does this need to happen in the useEffect loop to recreate api when accessToken exists?
	const api = constructApi(accessToken);

	// Run query
	useEffect(() => {
		if (!accessToken) {
			// should we set error here ? 
			setState({ ...state, loading: false, data: null });
			return;
		}

		if(!api || skip) {
			// should we set data and/or error here? 
			setState({ ...state, loading: false })
			return;
		}

		// make API query
		query(api)
			.then(apiResult => {
				setState({ ...state, loading: false, error: null, data: apiResult});
			})
			.catch(async apiError => {
				setState({ ...state, loading: false, data: null, error: await parseError(apiError) });
			})
	}, [accessToken, api, skip]);

	return [loading, error, data as DeepNonUndefineable<TData>];
}

const constructApi: (_accessToken: string | null) => HedwigApi | null = (_accessToken: string | null) => {
	if(!_accessToken) return null;

	return new HedwigApi(
		new Configuration({
			basePath: getCurrentHost(),
			apiKey: `Bearer ${_accessToken}`
		})
	);
}

const parseError: (_error: any) => Promise<ApiError | null> = async (_error: any) => {
	try {
		const jsonResponse = await _error.json();
		if(_error.status === 400) {
			return ValidationProblemDetailsFromJSON(jsonResponse) || null;
		} else {
			return ProblemDetailsFromJSON(jsonResponse) || null;
		}
	} catch (e) {
		console.error('Error cannot be converted to JSON');
		console.error(e);
		return ProblemDetailsFromJSON({
			detail: 'Inspect console for error',
			title: 'Unknown error'
		});
	}
}
