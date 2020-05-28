import { ChoiceList, ChoiceListProps } from "../../../../../components";
import React from "react";
import { fosterText, homelessnessText } from "../../../../../utils/models";
import FormField from "../../../../../components/Form/FormField";
import { Enrollment } from "../../../../../generated";

export const FosterCheckbox = ({ foster, updateFormData }: any) => <ChoiceList
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
