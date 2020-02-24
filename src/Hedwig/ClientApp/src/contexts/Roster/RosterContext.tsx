import React, { createContext, useState } from 'react';
import { DateRange } from '../../components';
import getDefaultDateRange from '../../utils/getDefaultDateRange';

export type RosterContextType = {
  showPastEnrollments: boolean;
  toggleShowPastEnrollments: () => void;
  dateRange: DateRange;
  setDateRange: (_: DateRange) => void;
  filterByRange: boolean;
  setFilterByRange: (_: boolean) => void;

};

const RosterContext = createContext<RosterContextType>({
  showPastEnrollments: false,
  toggleShowPastEnrollments: () => {},
  dateRange: getDefaultDateRange(),
  setDateRange: (_) => {},
  filterByRange: false,
  setFilterByRange: (_) => {},
});

const { Provider, Consumer } = RosterContext;

export type RosterProviderPropsType = {};

const RosterProvider: React.FC<RosterProviderPropsType> = ({ children }) => {
	const [showPastEnrollments, toggleShowPastEnrollments] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [filterByRange, setFilterByRange] = useState(false);
  
	return (
		<Provider value={{
      showPastEnrollments,
      toggleShowPastEnrollments: () => toggleShowPastEnrollments(!showPastEnrollments),
      dateRange,
      setDateRange,
      filterByRange,
      setFilterByRange
    }}>
			{children}
		</Provider>
	);
};

export { RosterProvider };
export { Consumer as RosterConsumer };
export default RosterContext;