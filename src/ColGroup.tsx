import React from 'react';
import { observer } from 'mobx-react-lite';
import { useModel } from './Context';
import { DoniTableColumn, ScrollProp } from './types';

interface ColGroupProps<RecordType> {
    columns: DoniTableColumn<RecordType>[];
    scroll?: ScrollProp;
}

const ColGroup = observer(function ColGroup<RecordType>(props: ColGroupProps<RecordType>) {
    const { headSizes } = useModel();

    // console.log('ColGroup render')

    return (
        <colgroup>
            {
                headSizes.map(({ width }, index) => (
                    <col key={ index } style={{ width: width + 'px' }} />
                ))
            }
        </colgroup>
    );
});

export default ColGroup;