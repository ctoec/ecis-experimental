import React, {
	Children,
	useEffect,
	useState,
	isValidElement,
	PropsWithChildren,
	createContext,
} from 'react';
import cx from 'classnames';
import { Tag } from '..';

type CardContextType = {
	isExpanded: boolean;
	toggleExpanded: () => void;
};

const CardContext = createContext<CardContextType>({
	isExpanded: false,
	toggleExpanded: () => {},
});

const { Provider: CardProvider } = CardContext;
export { CardContext };

export type CardProps = {
	appearance?: 'primary' | 'secondary';
	className?: string;
	stretched?: boolean;
	expanded?: boolean;
	onExpansionChange?: (_: boolean) => void;
	forceClose?: boolean;
	showTag?: boolean;
};

export function Card({
	appearance,
	className,
	stretched = true,
	expanded = false,
	onExpansionChange,
	forceClose,
	showTag = false,
	children,
}: PropsWithChildren<CardProps>) {
	const [isExpanded, setIsExpanded] = useState(expanded);
	const toggleExpanded = () => setIsExpanded(_isExpanded => !_isExpanded);

	useEffect(() => {
		if (onExpansionChange) {
			onExpansionChange(isExpanded);
		}
	}, [isExpanded]);

	useEffect(() => {
		if (forceClose) {
			setIsExpanded(false);
		}
	}, [forceClose]);

	return (
		<CardProvider
			value={{
				isExpanded,
				toggleExpanded,
			}}
		>
			<div
				className={cx(
					'oec-card',
					{
						[`oec-card--${appearance}`]: appearance,
						'oec-card--stretched': stretched,
					},
					className
				)}
			>
				{showTag && <Tag className="oec-card-tag" text="NEW" color="theme-color-primary" />}
				<div className="oec-card-cell">
					{Children.map(children, child => {
						if (!isValidElement(child)) {
							throw new Error('Invalid card child element');
						}
						const type = typeof child.type === 'string' ? child.type : child.type.name;
						if (type !== 'CardExpansion') {
							return child;
						}
					})}
				</div>
				<div
					className={cx({
						'oec-card-divider': isExpanded,
					})}
				></div>
				<div className={cx('oec-card-cell', 'oec-card-expansion')} hidden={!isExpanded}>
					{Children.map(children, child => {
						if (!isValidElement(child)) {
							throw new Error('Invalid card child element');
						}
						const type = typeof child.type === 'string' ? child.type : child.type.name;
						if (type === 'CardExpansion') {
							return child;
						}
					})}
				</div>
			</div>
		</CardProvider>
	);
}
