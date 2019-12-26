import { useParams, useLocation } from "react-router";
import React from "react";
import ReportsSummary from './ReportsSummary/ReportsSummary';
import ReportDetail from './ReportDetail/ReportDetail';
import { useAlertContext, AlertProvider } from "../../contexts/Alert/AlertContext";
import { AlertProps } from "../../components/Alert/Alert";


export default function Reports() {
	const { id } = useParams();
	const { state: alerts } = useLocation<AlertProps[]>();
	const alertContext = useAlertContext(alerts);
	
	let reportContainer;
	if (!id) {
		reportContainer = <ReportsSummary></ReportsSummary>;
	} else {
		reportContainer = <ReportDetail></ReportDetail>;
	}

	return (
		<AlertProvider value={alertContext}>
			{reportContainer}
		</AlertProvider>
	)
}