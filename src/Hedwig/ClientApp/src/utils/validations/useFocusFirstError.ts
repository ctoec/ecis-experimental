import { useEffect, DependencyList, useState } from 'react';

export function useFocusFirstError(deps: DependencyList | undefined = []) {
	const [firstElWithError, setFirstElWithError] = useState();
	useEffect(() => {
		// TODO: ALSO NEEDS TO ACCOUNT FOR FIELDSET ERRORS? radio buttons and stuff?
		const input = document.getElementsByClassName('usa-input--error')[0];
		setFirstElWithError(input);
	});

	return useEffect(() => {
		if (firstElWithError) { (firstElWithError as HTMLElement).focus() }
	}, [...deps, firstElWithError]);
}
