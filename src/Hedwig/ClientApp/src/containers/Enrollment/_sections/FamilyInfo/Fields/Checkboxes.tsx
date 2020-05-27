import { ChoiceList, ChoiceListProps } from "../../../../../components";
import React from "react";
import { fosterText, homelessnessText } from "../../../../../utils/models";
import FormField from "../../../../../components/Form/FormField";
import { Enrollment } from "../../../../../generated";

export const FosterCheckbox = () => <FormField<Enrollment, ChoiceListProps, boolean | null>
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

export const HomelessnessCheckbox = () =>
  <>
    <ChoiceList
      type="check"
      legend="Homelessness"
      id="homelessness"
      name="child.family.homelessness"
      defaultValue={homelessness ? ['homelessness'] : undefined}
      onChange={updateFormData((_, event) => event.target.checked)}
      options={[
        {
          text: homelessnessText(),
          value: 'homelessness',
        },
      ]}
    />
    <p className="usa-hint text-italic">
      Indicate if you are aware that the family has experienced housing insecurity, including
      overcrowded housing, within the last year.
			</p>
  </>