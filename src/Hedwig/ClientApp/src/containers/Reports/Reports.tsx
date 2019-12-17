import { useParams, useLocation } from "react-router";
import React from "react";
import ReportsSummary from './ReportsSummary/ReportsSummary';
import ReportDetail from './ReportDetail/ReportDetail';
import { useAlertContext, AlertProvider, AlertContextType } from "../../contexts/Alert/AlertContext";
import { AlertProps } from "../../components/Alert/Alert";


export default function Reports() {
	const { id } = useParams();
	const { state } = useLocation<AlertProps[]>();
	console.log(state);
	const alertContext = useAlertContext(state);
  const { alerts } = alertContext;
	console.log("reports", alerts);
	
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