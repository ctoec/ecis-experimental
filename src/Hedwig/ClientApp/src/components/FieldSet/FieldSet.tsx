import React from 'react';
import InlineIcon from '../InlineIcon/InlineIcon';

type FieldSetProps = {
  warning?: string;
  legend: string
};

const FieldSet: React.FC<FieldSetProps> = (props) => {
  const { warning, children, legend } = props;
  return (
    <fieldset className={`grid-gap grid-row usa-fieldset ${warning ? `usa-fieldset--warning` : ''}`} >
      <legend className="usa-sr-only">{legend}</legend>
      {warning && (
        <span className="usa-warning-message" id="field-set-warning-message" role="alert">
          <InlineIcon icon='incomplete' /> {warning}
        </span>
      )}
      {children}
    </fieldset>
  )
}
export default FieldSet;