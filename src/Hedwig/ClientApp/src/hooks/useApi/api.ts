import { HedwigApi, Configuration } from '../../generated';
import getCurrentHost from '../../utils/getCurrentHost';

export type Api = HedwigApi;

export const constructApi: (accessToken: string | null) => Api | null = (
	accessToken: string | null
) => {
	if (!accessToken) return null;

	return new HedwigApi(
		new Configuration({
			basePath: getCurrentHost(),
			apiKey: `Bearer ${accessToken}`,
		})
	);
};
