import React from 'react';

export type PrintModeContextType = {
  value: boolean,
  setValue: (_: boolean) => void
}

const PrintModeContext = React.createContext<PrintModeContextType>({
  value: false,
  setValue: () => {}
});
const { Provider, Consumer } = PrintModeContext;

export { Provider as PrintModeProvider };
export { Consumer as PrintModeConsumer };
export default PrintModeContext;
