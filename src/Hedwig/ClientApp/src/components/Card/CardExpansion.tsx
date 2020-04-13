import React, { Children, useState, isValidElement } from 'react';
import cx from 'classnames';

type CardExpansionProps = {};

export const CardExpansion: React.FC<CardExpansionProps> = ({ children }) => {
	return <>{children}</>;
};
