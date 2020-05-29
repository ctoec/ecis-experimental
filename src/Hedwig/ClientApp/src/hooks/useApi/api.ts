import { HedwigApi, Configuration } from '../../generated';
import getCurrentHost from '../../utils/getCurrentHost';

export type Api = HedwigApi;

export const constructApi: (accessToken: string) => Api = (accessToken) => {
	return new HedwigApi(
		new Configuration({
			basePath: getCurrentHost(),
			apiKey: `Bearer ${accessToken}`,
		})
	);
};
