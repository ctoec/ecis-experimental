import React, { useState } from 'react';
import Form from '../../components/Form/Form';
import FormField from '../../components/Form/FormField';
import { ChoiceListProps, ChoiceList } from '../../components';

type TestData = {
	name: string;
};
const FormTest: React.FC<{}> = () => {
	const [testData, setTestData] = useState<TestData>({ name: 'Cailyn' });

	const save = (_testData: TestData) => {
		setTestData(_testData);
	};

	return (
		<>
			<Form<TestData, {}>
				className="FamilyInfoForm"
				data={testData}
				onSave={save}
				additionalInformation={{}}
			>
				<FormField<TestData, ChoiceListProps, string, never>
					field={data => data.at('name')}
					parseValue={_ => _}
					render={props => (
						<ChoiceList
							id="name"
							options={[
								{ text: 'Cailyn', value: 'Cailyn' },
								{ text: 'Julia', value: 'Julia' },
							]}
							type="select"
							label="Name"
							selected={[props.data]}
							{...props}
						/>
					)}
				/>
			</Form>
			<div>{testData.name}</div>
		</>
	);
};

export default FormTest;
