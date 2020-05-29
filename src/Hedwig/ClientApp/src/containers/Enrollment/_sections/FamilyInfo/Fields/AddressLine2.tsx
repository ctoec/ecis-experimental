import { FamilyInfoFormFieldProps } from './common';
import { TextInput } from '../../../../../components';
import React from 'react';

export const AddressLine2: React.FC<FamilyInfoFormFieldProps> = ({ initialLoad }) => (
  <TextInput
    type="input"
    id="addressLine2"
    label="Address line 2"
    name="child.family.addressLine2"
    defaultValue={addressLine2 || ''}
    onChange={updateFormData()}
    optional={true}
  />
);
