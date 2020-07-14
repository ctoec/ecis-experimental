import React from 'react';
import { Button, ButtonProps } from '@ctoec/component-library';

type FormSumbitButtonProps = {
	text: string;
} & ButtonProps;

/**
 * Component for adding a form submit button
 * @param props
 */
const FormSubmitButton: React.FC<FormSumbitButtonProps> = (props) => {
	return <Button {...props} text={props.text} onClick="submit" />;
};

export default FormSubmitButton;
