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
  inlineBlock?: boolean;
};

const FieldSet: React.FC<FieldSetProps> = (props) => {
  const { error, children, legend, inlineBlock = false} = props;
  return (
    <fieldset className={`grid-gap grid-row usa-fieldset
      ${error ? `usa-fieldset--${error.type}` : ''}
      ${inlineBlock ? 'inline-block' : ''}
    `} >
      <legend className="usa-sr-only">{legend}</legend>
      {error && (
        <span className={`usa-${error.type}-message`} id="field-set-error-message" role="alert">
          {error.type === 'warning' ? <InlineIcon icon='incomplete' /> : ''} {error.message}
        </span>
      )}
      {children}
    </fieldset>
  )
}
export default FieldSet;