import { FundingSource } from '../../generated';

const CDC_STRING = 'Child day care';

export function fundingSourceFromString(str: string)
{
    console.log("funding source from string");
    switch(str) {
        case CDC_STRING:
            return FundingSource.CDC;
        default: // Private pay
        console.log("default undefined");
            return undefined;
    }
}

export function prettyFundingSource(source: FundingSource | null | undefined) {
    switch (source) {
        case FundingSource.CDC:
            return CDC_STRING;
        default:
            return 'Private pay';
    }
}
