import { useEffect, useState, useRef } from 'react';

/**
 * Allows for hiding an element when a user clicks outside of a given element 'ref'
 */
const useHideOnLostFocus = <T extends HTMLElement>() => {
	const [isComponentVisible, setIsComponentVisible] = useState(false);
	const ref = useRef<T>(null);

	function handleClickOutside(event: Event) {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			setIsComponentVisible(false);
		}
	}

	useEffect(() => {
		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		// TODO: add keyboard functionality
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	return { ref, isComponentVisible, setIsComponentVisible };
};

export default useHideOnLostFocus;
