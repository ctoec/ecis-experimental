import React from 'react';
import InlineIcon from '../InlineIcon/InlineIcon';
import { ValidationErrorFromJSONTyped } from '../../generated';

export type FormError = {
  message?: string;
  type: 'warning' | 'error';
};

type FieldSetProps = {
  error?: FormError;
  legend: string;
  display?: string;
};

const FieldSet: React.FC<FieldSetProps> = ({
  error,
  legend,
  display,
  children
}) => {
  return (
    <fieldset className={`grid-gap grid-row usa-fieldset 
      ${error ? ` usa-fieldset--${error.type}` : ''}
      ${display ? ` display-${display}`: ''}
    `} >
      <legend className="usa-sr-only">{legend}</legend>
      {error && (
        <span className={`usa-${error.type}-message`} id="field-set-error-message" role={error.type === "error" ? "alert" : "status"}>
          {error.type === 'warning' ? <InlineIcon icon='incomplete' /> : ''} {error.message}
        </span>
      )}
      {children}
    </fieldset>
  )
}
export default FieldSet;