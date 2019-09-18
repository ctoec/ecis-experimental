import React, { useState } from 'react';
import { Subtract } from 'utility-types';
import { PrintModeConsumer, PrintModeProvider as InternalPrintModeProvider } from './PrintModeContext';

export type PrintModeProviderPropsType = {
  value: boolean
}

const PrintModeProvider: React.FC<PrintModeProviderPropsType> = ({value, children}) => {
  const [printMode, setPrintMode] = useState(value);
  
  const togglePrintMode = (_: any) => {
    setPrintMode(!printMode);
  }

  return (
    <InternalPrintModeProvider value={{
      value: printMode,
      setValue: togglePrintMode
    }}>
      {children}
    </InternalPrintModeProvider>
  );
}

export type WithPrintModePropsType = {
  isPrintMode: boolean,
  togglePrintMode: () => void
}

const withPrintMode = <P extends WithPrintModePropsType>(Component: React.FC<P>): React.FC<Subtract<P, WithPrintModePropsType>> => 
  (props) =>
    <PrintModeConsumer>
      {({value, setValue}) =>
        <div className={value ? 'print': ''}>
          <Component {...props as P} isPrintMode={value} togglePrintMode={setValue} />
        </div>
      }
    </PrintModeConsumer>;

export default withPrintMode;

export { PrintModeProvider };