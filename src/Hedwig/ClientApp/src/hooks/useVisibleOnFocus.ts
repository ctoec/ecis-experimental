import { useEffect, useState, useRef} from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useVisibleOnFocus = <T extends HTMLElement>() => {
	const [isComponentVisible, setIsComponentVisible] = useState(false);
	const ref = useRef<T>(null);

	function handleClickOutside(event: Event) {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			setIsComponentVisible(false);
		}
	}

	useEffect(() => {
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});

	return { ref, isComponentVisible, setIsComponentVisible };
}

export default useVisibleOnFocus;