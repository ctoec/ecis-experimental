import { ChoiceList, ChoiceListProps } from "../../../../../components";
import React from "react";
import { fosterText } from "../../../../../utils/models";
import FormField from "../../../../../components/Form/FormField";
import { Enrollment } from "../../../../../generated";

export const FosterCheckbox: React.FC = ({ foster, updateFormData }: any) => <FormField<Enrollment, ChoiceListProps, boolean | null>
  getValue={data => data.at('child').at('foster')}
  inputComponent={ChoiceList}
  type="check"
  legend="Foster"
  id="foster"
  name="child.foster"
  defaultValue={foster ? ['foster'] : undefined}
  onChange={updateFormData((_, event) => event.target.checked)}
  options={[
    {
      text: fosterText(),
      value: 'foster',
    },
  ]}
/>
