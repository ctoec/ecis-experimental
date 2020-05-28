import React from "react";
import { ChoiceList } from "../../../../../components";
import { homelessnessText } from "../../../../../utils/models";

export const HomelessnessCheckbox = ({ homelessness, updateFormData }: any) =>
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