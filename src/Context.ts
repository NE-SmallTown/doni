import React, { useContext } from 'react';
import { IRootModel } from './types';

export const DoniTableRootStoreContext = React.createContext<null | IRootModel>(null);
DoniTableRootStoreContext.displayName = 'DoniTableRootStoreContext';

export function useModel() {
    const store = useContext(DoniTableRootStoreContext);

    if (store === null) {
        throw new Error('Store cannot be null, please add a context provider.');
    }

    return store;
}