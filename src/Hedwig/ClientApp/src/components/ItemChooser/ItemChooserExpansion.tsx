import React from 'react';

type ItemChooserExpansionProps = {
	showOnValue: string;
};

export const ItemChooserExpansion: React.FC<ItemChooserExpansionProps> = ({ children }) => {
	return <>{children}</>;
};