import { FamilyDetermination } from "../../../../../../generated"
import React from "react"
import { InlineIcon, Button } from "../../../../../../components"
import currencyFormatter from "../../../../../../utils/currencyFormatter"
import dateFormatter from "../../../../../../utils/dateFormatter"
import { ExpandCard } from "../../../../../../components/Card/ExpandCard"

export const CardContentWithExpandCard = ({determination}: 
	{determination: FamilyDetermination}
) => {
		return (
			<div className="usa-grid">
				<div className="grid-row">
					<div className="grid-col">
						<div className="grid-row text-bold">
							<div className="grid-col">Household size</div>
							<div className="grid-col">Income</div>
							<div className="grid-col">Determination on</div>
						</div>
						<div className="grid-row">
							<div className="grid-col">
								<div className="margin-top-2">
									{determination.numberOfPeople || InlineIcon({ icon: 'incomplete' })}
								</div>
							</div>
							<div className="grid-col">
								<div className="margin-top-2">
									{determination.income
										? currencyFormatter(determination.income)
										: InlineIcon({ icon: 'incomplete' })}
								</div>
							</div>
							<div className="grid-col">
								<div className="margin-top-2">
									{determination.determinationDate
										? dateFormatter(determination.determinationDate)
										: InlineIcon({ icon: 'incomplete' })}
								</div>
							</div>
						</div>
					</div>
					<div className="grid-col-1 flex-align-self--center">
						<ExpandCard>
							<Button text="Edit" appearance="unstyled" />
						</ExpandCard>
					</div>
				</div>
			</div>
		);
}
