import {FundingSource} from '../generated/globalTypes';

export default function getColorForFundingSource(source: FundingSource) {
    switch(source) {
        case FundingSource.CDC:
            return 'accent-cool';
        
    }
}