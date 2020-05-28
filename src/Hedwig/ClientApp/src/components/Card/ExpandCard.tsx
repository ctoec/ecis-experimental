import React, { useContext, isValidElement, ReactEventHandler, Children } from 'react';
import { CardContext } from '..';

/**
 * Component for declaratively expanding/collapsing card
 * @param props
 */
export const ExpandCard: React.FC = ({ children }) => {
	const { toggleExpanded } = useContext(CardContext);

	if (!isValidElement(children)) {
		throw new Error('Invalid children to ExpandCard');
	}

	return (
		<>
			{Children.map(children, (child) => {
				const { type: Type, props, key } = child;
				return (
					<Type
						{...key}
						{...props}
						onClick={(e: ReactEventHandler) => {
							toggleExpanded();
							if (props.onClick) {
								props.onClick(e);
							}
						}}
					/>
				);
			})}
		</>
	);
};
