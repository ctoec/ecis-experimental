import React from 'react';
import { Button } from '..';
import { ButtonProps } from '../Button/Button';

type FormSumbitButtonProps = {
	text: string;
} & Pick<ButtonProps, Exclude<keyof ButtonProps, 'text'>>;

/**
 * Component for adding a form submit button,
 * to be used with generic Form
 * @param props
 */
const FormSubmitButton: React.FC<FormSumbitButtonProps> = ({ text, ...props }) => {
	return <Button {...props} text={text} onClick="submit" />;
};

export default FormSubmitButton;
