import React, { useContext } from 'react';
import { IFormModel, IFormItemInfo } from './types';

export const DoniFormRootStoreContext = React.createContext<null | IFormModel>(null);
DoniFormRootStoreContext.displayName = 'DoniFormRootStoreContext';

export function useModel() {
    const store = useContext(DoniFormRootStoreContext);

    if (store === null) {
        throw new Error('Store cannot be null, please add a context provider.');
    }

    return store;
}

export const DoniFormItemInfoContext = React.createContext<null | IFormItemInfo>(null);
DoniFormRootStoreContext.displayName = 'DoniFormItemInfoContext';

export function useFormItemInfo() {
    const store = useContext(DoniFormItemInfoContext);

    if (store === null) {
        throw new Error('Store cannot be null, please add a context provider.');
    }

    return store;
}