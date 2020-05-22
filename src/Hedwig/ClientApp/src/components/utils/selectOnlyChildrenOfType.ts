import React from 'react';

function isNonNullable<T>(_: T): _ is NonNullable<T> {
	// Intentionally using !=
	// Checks for both undefined and null
	return _ != undefined;
}

export const selectOnlyChildrenOfType: (children: React.ReactNode, type: React.FC<any>) => React.ReactNode[] = (
	children, type
) => {
	const processedChildren = React.Children.map(children, child => {
		if (React.isValidElement(child)) {
			if (!!child.type && (child.type as Function).name === type.name) {
				return child;
			}
		}
	});
	return processedChildren ? processedChildren.filter(isNonNullable) : [];
}