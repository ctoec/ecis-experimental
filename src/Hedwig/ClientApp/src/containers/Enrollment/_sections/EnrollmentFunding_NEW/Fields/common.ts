import { FundingSpace } from "../../../../../generated";

export type EnrollmentFormFieldProps = {
	initialLoad?: boolean;
};

export type FundingFormFieldProps = {
	fundingId: number;
	fundingSpaces: FundingSpace[];
} & EnrollmentFormFieldProps;

