import React from 'react';
import { Button } from '..';
import { ButtonProps } from '../Button/Button';

type FormSumbitButtonProps = {
	text: string;
} & ButtonProps;

const FormSubmitButton: React.FC<FormSumbitButtonProps> = ({ text }) => {
	return <Button text={text} onClick="submit" />;
};

export default FormSubmitButton;
