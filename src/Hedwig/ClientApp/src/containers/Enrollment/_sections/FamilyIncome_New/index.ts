import { Section } from "../../enrollmentTypes";
import { Status } from "./Status";
import { Summary } from "./Summary";
import { NewForm } from "./NewForm";
import { UpdateForm } from "./UpdateForm";

const FamilyIncome: Section = {
	key: 'family-income',
	name: 'Family income determination',
	status: Status,
	Summary: Summary,
	Form: NewForm,
	UpdateForm: UpdateForm,
}

export default FamilyIncome;
